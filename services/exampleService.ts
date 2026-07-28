import db from '../models';
import { CreateExampleDto } from '../types';
import * as XLSX from 'xlsx';

const Examples = db.Examples;

class ExampleService {
  async getAllExamples() {
    return await Examples.findAll({
      order: [['id', 'ASC']]
    });
  }

  async createExample(data: CreateExampleDto) {
    return await Examples.create(data);
  }

  async updateExample(id: string, data: Partial<CreateExampleDto>) {
    const example = await Examples.findByPk(id);
    if (!example) return null;
    await example.update(data);
    return example;
  }

  async deleteExample(id: string): Promise<boolean> {
    const deleted = await Examples.destroy({ where: { id } });
    return deleted > 0;
  }

  async importExamplesFromBuffer(buffer: Buffer, defaultGrammarId?: number, defaultVocabId?: number) {
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
    const grammars = await db.Grammars.findAll({ attributes: ['id'] });
    const validGrammarIds = new Set(grammars.map((g: any) => g.id));

    const vocabularies = await db.Vocabularies.findAll({ attributes: ['id'] });
    const validVocabIds = new Set(vocabularies.map((v: any) => v.id));

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const example = findKey(row, ['example', 'ví dụ', 'vidu', 'sentence', 'câu']);
      const meaning = findKey(row, ['meaning', 'nghĩa', 'nghia', 'definition', 'dịch']);
      const pinyin = findKey(row, ['pinyin', 'phiên âm', 'phienam']);
      const audioUrl = findKey(row, ['audiourl', 'âm thanh', 'audio']);

      // Skip completely empty rows
      if (!example && !meaning && !pinyin) {
        continue;
      }

      const rowGrammarIdVal = findKey(row, ['grammarid', 'grammar_id', 'ngữ pháp', 'nguphap']);
      const grammarId = rowGrammarIdVal ? parseInt(rowGrammarIdVal, 10) : defaultGrammarId;

      const rowVocabIdVal = findKey(row, ['vocabularyid', 'vocabulary_id', 'từ vựng', 'tuvung', 'vocab_id']);
      const vocabId = rowVocabIdVal ? parseInt(rowVocabIdVal, 10) : defaultVocabId;

      if (!example || !meaning || !pinyin) {
        throw new Error(`Row ${i + 2}: Missing required fields (example, meaning, pinyin)`);
      }

      if (grammarId && isNaN(grammarId)) {
        throw new Error(`Row ${i + 2}: Grammar ID must be a valid number`);
      }

      if (grammarId && !validGrammarIds.has(grammarId)) {
        throw new Error(`Row ${i + 2}: Grammar ID ${grammarId} does not exist in the database`);
      }

      if (vocabId && isNaN(vocabId)) {
        throw new Error(`Row ${i + 2}: Vocabulary ID must be a valid number`);
      }

      if (vocabId && !validVocabIds.has(vocabId)) {
        throw new Error(`Row ${i + 2}: Vocabulary ID ${vocabId} does not exist in the database`);
      }

      parsedRows.push({
        example: String(example).trim(),
        pinyin: String(pinyin).trim(),
        meaning: String(meaning).trim(),
        audioUrl: audioUrl ? String(audioUrl).trim() : null,
        grammarId: grammarId || null,
        vocabularyId: vocabId || null
      });
    }

    const transaction = await db.sequelize.transaction();
    try {
      const created = await Examples.bulkCreate(parsedRows, { transaction });
      await transaction.commit();
      return created;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new ExampleService();