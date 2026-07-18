import db from '../models';
import { CreateWritingSheetDto, CreateWritingSheetItemDto } from '../types';

const WritingSheets = db.WritingSheets;
const WritingSheetItem = db.WritingSheetItem;

class WritingSheetService {
  async getWritingSheets(userId?: number) {
    const whereCondition = userId ? { userId } : {};
    return await WritingSheets.findAll({
      where: whereCondition,
      include: [
        {
          model: WritingSheetItem,
          as: 'items',
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: WritingSheetItem, as: 'items' }, 'id', 'ASC']
      ]
    });
  }

  async createWritingSheet(userId?: number, title: string = 'File luyện viết từ vựng') {
    return await WritingSheets.create({
      userId: userId || null,
      title,
    });
  }

  async getWritingSheetDetail(sheetId: number, userId?: number) {
    const whereCondition: any = { id: sheetId };
    if (userId) {
      whereCondition.userId = userId;
    }
    return await WritingSheets.findOne({
      where: whereCondition,
      include: [
        {
          model: WritingSheetItem,
          as: 'items',
        }
      ],
      order: [
        [{ model: WritingSheetItem, as: 'items' }, 'id', 'ASC']
      ]
    });
  }

  async updateWritingSheet(sheetId: number, title: string, userId?: number) {
    const sheet = await this.getWritingSheetDetail(sheetId, userId);
    if (!sheet) return null;
    sheet.title = title;
    await sheet.save();
    return sheet;
  }

  async deleteWritingSheet(sheetId: number, userId?: number): Promise<boolean> {
    const whereCondition: any = { id: sheetId };
    if (userId) {
      whereCondition.userId = userId;
    }
    const deleted = await WritingSheets.destroy({ where: whereCondition });
    return deleted > 0;
  }

  async addWritingSheetItem(sheetId: number, data: CreateWritingSheetItemDto, userId?: number) {
    const sheet = await this.getWritingSheetDetail(sheetId, userId);
    if (!sheet) {
      throw new Error('Writing sheet not found');
    }
    return await WritingSheetItem.create({
      writingSheetId: sheetId,
      vocab: data.vocab,
      pinyin: data.pinyin,
      meaning: data.meaning,
    });
  }

  async updateWritingSheetItem(itemId: number, data: Partial<CreateWritingSheetItemDto>, _userId?: number) {
    const item = await WritingSheetItem.findByPk(itemId);
    if (!item) return null;
    await item.update(data);
    return item;
  }

  async deleteWritingSheetItem(itemId: number, _userId?: number): Promise<boolean> {
    const deleted = await WritingSheetItem.destroy({ where: { id: itemId } });
    return deleted > 0;
  }
}

export default new WritingSheetService();
