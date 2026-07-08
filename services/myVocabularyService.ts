import db from '../models';
import { CreateMyVocabularyListDto, CreateMyVocabularyItemDto } from '../types';

const MyVocabularies = db.MyVocabularies;
const MyVocabulary = db.MyVocabulary;

class MyVocabularyService {
  async getVocabularyLists(userId: number) {
    return await MyVocabularies.findAll({
      where: { userId },
      order: [['id', 'DESC']]
    });
  }

  async createVocabularyList(userId: number, name: string) {
    return await MyVocabularies.create({ userId, name });
  }

  async getVocabularyListDetail(userId: number, listId: number) {
    return await MyVocabularies.findOne({
      where: { id: listId, userId },
      include: [{
        model: MyVocabulary,
        as: 'vocabularies'
      }]
    });
  }

  async updateVocabularyList(userId: number, listId: number, name: string) {
    const list = await MyVocabularies.findOne({ where: { id: listId, userId } });
    if (!list) return null;
    await list.update({ name });
    return list;
  }

  async deleteVocabularyList(userId: number, listId: number): Promise<boolean> {
    const deleted = await MyVocabularies.destroy({ where: { id: listId, userId } });
    return deleted > 0;
  }

  async addVocabularyItem(userId: number, listId: number, data: CreateMyVocabularyItemDto) {
    const list = await MyVocabularies.findOne({ where: { id: listId, userId } });
    if (!list) return null;
    return await MyVocabulary.create({
      ...data,
      myVocabulairesId: listId
    });
  }

  async updateVocabularyItem(userId: number, itemId: number, data: Partial<CreateMyVocabularyItemDto>) {
    const item = await MyVocabulary.findOne({
      where: { id: itemId },
      include: [{
        model: MyVocabularies,
        as: 'myVocabulariesList',
        where: { userId }
      }]
    });
    if (!item) return null;
    await item.update(data);
    return item;
  }

  async deleteVocabularyItem(userId: number, itemId: number): Promise<boolean> {
    const item = await MyVocabulary.findOne({
      where: { id: itemId },
      include: [{
        model: MyVocabularies,
        as: 'myVocabulariesList',
        where: { userId }
      }]
    });
    if (!item) return false;
    await item.destroy();
    return true;
  }
}

export default new MyVocabularyService();
