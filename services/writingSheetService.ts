import db from '../models';
import { CreateWritingSheetDto, CreateWritingSheetItemDto } from '../types';

const WritingSheets = db.WritingSheets;
const WritingSheetItem = db.WritingSheetItem;

class WritingSheetService {
  async getWritingSheets(userId?: number) {
    const whereCondition = userId ? { userId } : {};
    const sheets = await WritingSheets.findAll({
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

    // Clean up duplicate sheets with identical title if any exist
    const seenTitles = new Set<string>();
    const uniqueSheets = [];
    const duplicateIdsToDelete: number[] = [];

    for (const sheet of sheets) {
      const normalizedTitle = (sheet.title || '').trim();
      if (seenTitles.has(normalizedTitle)) {
        duplicateIdsToDelete.push(sheet.id);
      } else {
        seenTitles.add(normalizedTitle);
        uniqueSheets.push(sheet);
      }
    }

    if (duplicateIdsToDelete.length > 0) {
      WritingSheets.destroy({ where: { id: duplicateIdsToDelete } }).catch(err => {
        console.error("Error cleaning up duplicate writing sheets:", err);
      });
    }

    return uniqueSheets;
  }

  async createWritingSheet(userId?: number, title: string = 'File luyện viết từ vựng', findIfExists: boolean = false) {
    const normalizedTitle = title.trim();
    if (findIfExists) {
      const whereCondition: any = { title: normalizedTitle };
      if (userId) {
        whereCondition.userId = userId;
      }
      const existing = await WritingSheets.findOne({
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
      if (existing) {
        return { sheet: existing, isNew: false };
      }
    }

    const newSheet = await WritingSheets.create({
      userId: userId || null,
      title: normalizedTitle,
    });

    const sheetWithDetail = await this.getWritingSheetDetail(newSheet.id, userId);
    return { sheet: sheetWithDetail || newSheet, isNew: true };
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
