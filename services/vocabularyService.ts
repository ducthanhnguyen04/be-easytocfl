import db from '../models';
import { CreateVocabularyDto } from '../types';
import * as XLSX from 'xlsx';

const Vocabularies = db.Vocabularies;
const Examples = db.Examples;

class VocabularyService {
  async getAllVocabularies() {
    return await Vocabularies.findAll({
      order: [['id', 'ASC']]
    });
  }

  async createVocabulary(data: CreateVocabularyDto) {
    const { examples, ...vocabData } = data;
    if (!examples || !Array.isArray(examples) || examples.length === 0) {
      return await Vocabularies.create(vocabData);
    }

    const transaction = await db.sequelize.transaction();
    try {
      const newVocabulary = await Vocabularies.create(vocabData, { transaction });
      const exampleRecords = examples
        .filter(ex => ex.example && ex.example.trim())
        .map(ex => ({
          example: ex.example.trim(),
          meaning: ex.meaning ? ex.meaning.trim() : '',
          pinyin: ex.pinyin ? ex.pinyin.trim() : '',
          audioUrl: ex.audioUrl ? ex.audioUrl.trim() : null,
          vocabularyId: newVocabulary.id,
          grammarId: null
        }));

      let createdExamples: any[] = [];
      if (exampleRecords.length > 0) {
        createdExamples = await Examples.bulkCreate(exampleRecords, { transaction });
      }

      await transaction.commit();
      return {
        ...newVocabulary.toJSON(),
        examples: createdExamples
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createBulkVocabularies(items: CreateVocabularyDto[], defaultLessonId?: number) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Danh sách từ vựng không hợp lệ hoặc rỗng');
    }

    const lessons = await db.Lessons.findAll({ attributes: ['id'] });
    const validLessonIds = new Set(lessons.map((l: any) => l.id));

    const transaction = await db.sequelize.transaction();
    try {
      const createdVocabularies: any[] = [];
      const createdExamplesList: any[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const vocabulary = item.vocabulary?.trim();
        const meaning = item.meaning?.trim();
        const englishMeaning = item.englishMeaning?.trim();
        const pinyin = item.pinyin?.trim();
        const lessonId = item.lessonId ? Number(item.lessonId) : defaultLessonId;

        if (!vocabulary || !meaning || !englishMeaning || !pinyin) {
          throw new Error(`Mục thứ ${i + 1} (${vocabulary || 'Chưa có từ'}): Thiếu thông tin bắt buộc (vocabulary, meaning, englishMeaning, pinyin)`);
        }

        if (!lessonId || isNaN(lessonId)) {
          throw new Error(`Mục thứ ${i + 1} (${vocabulary}): Thiếu Mã bài học (lessonId)`);
        }

        if (!validLessonIds.has(lessonId)) {
          throw new Error(`Mục thứ ${i + 1} (${vocabulary}): Mã bài học ${lessonId} không tồn tại`);
        }

        const vocabRecord = await Vocabularies.create({
          vocabulary,
          meaning,
          englishMeaning,
          pinyin,
          audioUrl: item.audioUrl || '',
          lessonId
        }, { transaction });

        createdVocabularies.push(vocabRecord);

        if (Array.isArray(item.examples) && item.examples.length > 0) {
          for (const ex of item.examples) {
            if (ex.example && ex.example.trim()) {
              createdExamplesList.push({
                example: ex.example.trim(),
                meaning: ex.meaning ? ex.meaning.trim() : '',
                pinyin: ex.pinyin ? ex.pinyin.trim() : '',
                audioUrl: ex.audioUrl ? ex.audioUrl.trim() : null,
                vocabularyId: vocabRecord.id,
                grammarId: null
              });
            }
          }
        }
      }

      if (createdExamplesList.length > 0) {
        await Examples.bulkCreate(createdExamplesList, { transaction });
      }

      await transaction.commit();
      return {
        vocabularies: createdVocabularies,
        examplesCount: createdExamplesList.length
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateVocabulary(id: string, data: Partial<CreateVocabularyDto>) {
    const vocabulary = await Vocabularies.findByPk(id);
    if (!vocabulary) return null;
    await vocabulary.update(data);
    return vocabulary;
  }

  async deleteVocabulary(id: string): Promise<boolean> {
    const deleted = await Vocabularies.destroy({ where: { id } });
    return deleted > 0;
  }

  async getVocabularyByLessonId(lessonId: string | number) {
    return await Vocabularies.findAll({
      where: { lessonId },
      order: [['id', 'ASC']]
    });
  }

  async importVocabulariesFromBuffer(buffer: Buffer, defaultLessonId?: number) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<any>(worksheet);

    if (rawData.length === 0) {
      throw new Error('Excel file is empty');
    }

    const findKey = (obj: any, keysToSearch: string[]) => {
      const objKeys = Object.keys(obj);
      for (const k of objKeys) {
        const normalizedK = k.trim().toLowerCase();
        if (keysToSearch.includes(normalizedK)) {
          return obj[k];
        }
      }
      return undefined;
    };

    const parsedRows = [];
    const lessons = await db.Lessons.findAll({ attributes: ['id'] });
    const validLessonIds = new Set(lessons.map((l: any) => l.id));

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const vocabulary = findKey(row, ['vocabulary', 'từ vựng', 'tuvung', 'word', 'chinese', 'chữ hán']);
      const meaning = findKey(row, ['meaning', 'nghĩa', 'nghia', 'definition', 'nghĩa tiếng việt', 'nghiatiengviet']);
      const englishMeaning = findKey(row, ['englishmeaning', 'nghĩa tiếng anh', 'nghia tieng anh', 'english']);
      const pinyin = findKey(row, ['pinyin', 'phiên âm', 'phienam']);

      // Skip completely empty rows or rows with no content (common at the end of Excel sheets)
      if (!vocabulary && !meaning && !englishMeaning && !pinyin) {
        continue;
      }

      const rowLessonIdVal = findKey(row, ['lessonid', 'lesson_id', 'mã bài học', 'mabaihoc', 'lesson']);
      const lessonId = rowLessonIdVal ? parseInt(rowLessonIdVal, 10) : defaultLessonId;

      if (!vocabulary || !meaning || !englishMeaning || !pinyin) {
        throw new Error(`Row ${i + 2}: Missing required fields (vocabulary, meaning, pinyin)`);
      }

      if (!lessonId || isNaN(lessonId)) {
        throw new Error(`Row ${i + 2}: Lesson ID is required and must be a valid number`);
      }

      if (!validLessonIds.has(lessonId)) {
        throw new Error(`Row ${i + 2}: Lesson ID ${lessonId} does not exist in the database`);
      }

      // Extract examples if present in this row
      const examples: { example: string; meaning: string; pinyin: string }[] = [];

      const exVal = findKey(row, ['example', 'ví dụ', 'vidu', 'câu ví dụ', 'cau vi du', 'example_sentence', 'examplesentence', 'example text']);
      const exMeaningVal = findKey(row, ['examplemeaning', 'example_meaning', 'nghĩa ví dụ', 'nghia vidu', 'dịch ví dụ', 'dich vidu', 'nghĩa của ví dụ', 'example translation']);
      const exPinyinVal = findKey(row, ['examplepinyin', 'example_pinyin', 'pinyin ví dụ', 'pinyin vidu', 'phiên âm ví dụ', 'phien am vi du']);

      if (exVal && String(exVal).trim()) {
        const exLines = String(exVal).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        const meaningLines = exMeaningVal ? String(exMeaningVal).split(/\r?\n/).map(s => s.trim()) : [];
        const pinyinLines = exPinyinVal ? String(exPinyinVal).split(/\r?\n/).map(s => s.trim()) : [];

        if (exLines.length > 1 && (meaningLines.length === exLines.length || meaningLines.length === 0)) {
          exLines.forEach((line, idx) => {
            examples.push({
              example: line,
              meaning: meaningLines[idx] || '',
              pinyin: pinyinLines[idx] || ''
            });
          });
        } else {
          examples.push({
            example: String(exVal).trim(),
            meaning: exMeaningVal ? String(exMeaningVal).trim() : '',
            pinyin: exPinyinVal ? String(exPinyinVal).trim() : ''
          });
        }
      }

      // Also check numbered example fields: example1, ví dụ 1, etc.
      for (let num = 1; num <= 5; num++) {
        const numExVal = findKey(row, [`example${num}`, `example_${num}`, `ví dụ ${num}`, `vidu${num}`, `vidu ${num}`, `câu ví dụ ${num}`]);
        const numExMeaningVal = findKey(row, [`examplemeaning${num}`, `example_meaning_${num}`, `nghĩa ví dụ ${num}`, `nghia vidu ${num}`, `dịch ví dụ ${num}`]);
        const numExPinyinVal = findKey(row, [`examplepinyin${num}`, `example_pinyin_${num}`, `pinyin ví dụ ${num}`, `phien am vi du ${num}`]);

        if (numExVal && String(numExVal).trim()) {
          examples.push({
            example: String(numExVal).trim(),
            meaning: numExMeaningVal ? String(numExMeaningVal).trim() : '',
            pinyin: numExPinyinVal ? String(numExPinyinVal).trim() : ''
          });
        }
      }

      parsedRows.push({
        vocabData: {
          vocabulary: String(vocabulary).trim(),
          pinyin: String(pinyin).trim(),
          meaning: String(meaning).trim(),
          englishMeaning: String(englishMeaning).trim(),
          lessonId: lessonId
        },
        examples
      });
    }

    const transaction = await db.sequelize.transaction();
    try {
      const createdVocabularies: any[] = [];
      const createdExamplesList: any[] = [];

      for (const item of parsedRows) {
        const vocabRecord = await Vocabularies.create(item.vocabData, { transaction });
        createdVocabularies.push(vocabRecord);

        if (item.examples && item.examples.length > 0) {
          for (const ex of item.examples) {
            createdExamplesList.push({
              example: ex.example,
              meaning: ex.meaning || '',
              pinyin: ex.pinyin || '',
              vocabularyId: vocabRecord.id,
              grammarId: null
            });
          }
        }
      }

      if (createdExamplesList.length > 0) {
        await Examples.bulkCreate(createdExamplesList, { transaction });
      }

      await transaction.commit();
      return {
        vocabularies: createdVocabularies,
        examplesCount: createdExamplesList.length
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new VocabularyService();