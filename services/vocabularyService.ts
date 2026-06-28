import db from '../models';
import { CreateVocabularyDto } from '../types';
import * as XLSX from 'xlsx';

const Vocabularies = db.Vocabularies;

class VocabularyService {
  async getAllVocabularies() {
    return await Vocabularies.findAll({
      order: [['id', 'ASC']]
    });
  }

  async createVocabulary(data: CreateVocabularyDto) {
    return await Vocabularies.create(data);
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
      const vocabulary = findKey(row, ['vocabulary', 'từ vựng', 'tuvung', 'word', 'chinese']);
      const meaning = findKey(row, ['meaning', 'nghĩa', 'nghia', 'definition']);
      const englishMeaning = findKey(row, ['englishMeaning', 'nghĩa tiếng anh', 'nghia tieng anh']);
      const pinyin = findKey(row, ['pinyin', 'phiên âm', 'phienam']);
      const audioUrl = findKey(row, ['audiourl', 'audio', 'âm thanh', 'amthanh', 'url']);

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

      parsedRows.push({
        vocabulary: String(vocabulary).trim(),
        pinyin: String(pinyin).trim(),
        meaning: String(meaning).trim(),
        englishMeaning: String(englishMeaning).trim(),
        audioUrl: audioUrl ? String(audioUrl).trim() : undefined,
        lessonId: lessonId
      });
    }

    const transaction = await db.sequelize.transaction();
    try {
      const created = await Vocabularies.bulkCreate(parsedRows, { transaction });
      await transaction.commit();
      return created;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new VocabularyService();