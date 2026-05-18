import db from '../models';
import { CreateVocabularyDto } from '../types';

const Vocabularies = db.Vocabularies;

class VocabularyService {
  async getAllVocabularies() {
    return await Vocabularies.findAll();
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
    return await Vocabularies.findAll({ where: { lessonId } });
  }
}

export default new VocabularyService();