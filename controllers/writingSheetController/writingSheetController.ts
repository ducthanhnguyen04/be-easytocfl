import writingSheetService from '../../services/writingSheetService';
import { Response } from 'express';
import { AuthRequest, AppError, CreateWritingSheetItemDto } from '../../types';

class WritingSheetController {
  async getWritingSheets(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const sheets = await writingSheetService.getWritingSheets(userId);
      return res.status(200).json({ message: 'Get writing sheets successfully', sheets });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async createWritingSheet(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { title, findIfExists } = req.body as { title: string; findIfExists?: boolean };
      const result = await writingSheetService.createWritingSheet(userId, title, findIfExists);
      return res.status(201).json({
        message: result.isNew ? 'Create writing sheet successfully' : 'Writing sheet already exists',
        sheet: result.sheet,
        isNew: result.isNew
      });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async getWritingSheetDetail(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const sheetId = parseInt(req.params.sheetId as string, 10);
      const sheet = await writingSheetService.getWritingSheetDetail(sheetId, userId);
      if (!sheet) {
        return res.status(404).json({ message: 'Writing sheet not found' });
      }
      return res.status(200).json({ message: 'Get writing sheet detail successfully', sheet });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async updateWritingSheet(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const sheetId = parseInt(req.params.sheetId as string, 10);
      const { title } = req.body as { title: string };
      const updatedSheet = await writingSheetService.updateWritingSheet(sheetId, title, userId);
      if (!updatedSheet) {
        return res.status(404).json({ message: 'Writing sheet not found' });
      }
      return res.status(200).json({ message: 'Update writing sheet successfully', sheet: updatedSheet });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async deleteWritingSheet(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const sheetId = parseInt(req.params.sheetId as string, 10);
      const deleted = await writingSheetService.deleteWritingSheet(sheetId, userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Writing sheet not found to delete' });
      }
      return res.status(200).json({ message: 'Delete writing sheet successfully' });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async addWritingSheetItem(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const sheetId = parseInt(req.params.sheetId as string, 10);
      const { vocab, pinyin, meaning } = req.body as CreateWritingSheetItemDto;

      if (!vocab || !pinyin || !meaning) {
        return res.status(400).json({ message: 'Vocab, pinyin, and meaning are required' });
      }

      const item = await writingSheetService.addWritingSheetItem(sheetId, { vocab, pinyin, meaning }, userId);
      return res.status(201).json({ message: 'Add item successfully', item });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async updateWritingSheetItem(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const itemId = parseInt(req.params.itemId as string, 10);
      const updatedItem = await writingSheetService.updateWritingSheetItem(itemId, req.body, userId);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      return res.status(200).json({ message: 'Update item successfully', item: updatedItem });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }

  async deleteWritingSheetItem(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const itemId = parseInt(req.params.itemId as string, 10);
      const deleted = await writingSheetService.deleteWritingSheetItem(itemId, userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Item not found to delete' });
      }
      return res.status(200).json({ message: 'Delete item successfully' });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
  }
}

export default new WritingSheetController();
