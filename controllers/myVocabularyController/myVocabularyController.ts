import { Response } from 'express';
import { AuthRequest } from '../../types';
import myVocabularyService from '../../services/myVocabularyService';

class MyVocabularyController {
  async getVocabularyLists(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const lists = await myVocabularyService.getVocabularyLists(userId);
      return res.json({ message: 'Get all vocabulary lists successfully', lists });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createVocabularyList(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const newList = await myVocabularyService.createVocabularyList(userId, name);
      return res.status(201).json({ message: 'Create vocabulary list successfully', list: newList });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async getVocabularyListDetail(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const listId = parseInt(req.params.listId as string, 10);
      if (isNaN(listId)) {
        return res.status(400).json({ message: 'Invalid list ID' });
      }
      const list = await myVocabularyService.getVocabularyListDetail(userId, listId);
      if (!list) {
        return res.status(404).json({ message: 'Vocabulary list not found' });
      }
      return res.json({ message: 'Get vocabulary list details successfully', list });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateVocabularyList(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const listId = parseInt(req.params.listId as string, 10);
      if (isNaN(listId)) {
        return res.status(400).json({ message: 'Invalid list ID' });
      }
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const updatedList = await myVocabularyService.updateVocabularyList(userId, listId, name);
      if (!updatedList) {
        return res.status(404).json({ message: 'Vocabulary list not found or unauthorized' });
      }
      return res.json({ message: 'Update vocabulary list successfully', list: updatedList });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteVocabularyList(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const listId = parseInt(req.params.listId as string, 10);
      if (isNaN(listId)) {
        return res.status(400).json({ message: 'Invalid list ID' });
      }
      const deleted = await myVocabularyService.deleteVocabularyList(userId, listId);
      if (!deleted) {
        return res.status(404).json({ message: 'Vocabulary list not found or unauthorized' });
      }
      return res.json({ message: 'Delete vocabulary list successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async addVocabularyItem(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const listId = parseInt(req.params.listId as string, 10);
      if (isNaN(listId)) {
        return res.status(400).json({ message: 'Invalid list ID' });
      }
      const { vocab, pinyin, meaning, example, exampleMeaning } = req.body;
      if (!vocab || !pinyin || !meaning) {
        return res.status(400).json({ message: 'vocab, pinyin, and meaning are required' });
      }
      const newItem = await myVocabularyService.addVocabularyItem(userId, listId, {
        vocab,
        pinyin,
        meaning,
        example,
        exampleMeaning
      });
      if (!newItem) {
        return res.status(404).json({ message: 'Vocabulary list not found or unauthorized' });
      }
      return res.status(201).json({ message: 'Add vocabulary item successfully', item: newItem });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateVocabularyItem(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const itemId = parseInt(req.params.itemId as string, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      const updatedItem = await myVocabularyService.updateVocabularyItem(userId, itemId, req.body);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Vocabulary item not found or unauthorized' });
      }
      return res.json({ message: 'Update vocabulary item successfully', item: updatedItem });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteVocabularyItem(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const itemId = parseInt(req.params.itemId as string, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      const deleted = await myVocabularyService.deleteVocabularyItem(userId, itemId);
      if (!deleted) {
        return res.status(404).json({ message: 'Vocabulary item not found or unauthorized' });
      }
      return res.json({ message: 'Delete vocabulary item successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new MyVocabularyController();
