import { Request, Response } from 'express';
import levelService from '../../services/levelService';
import { CreateLevelDto } from '../../types';
import { uploadToSupabase } from '../../utils/supabase';
import { memoryCache } from '../../utils/memoryCache';

class LevelController {
  async getAllLevels(_req: Request, res: Response): Promise<Response> {
    try {
      const cached = memoryCache.get<any>('levels_all');
      if (cached) {
        return res.status(200).json({ message: 'Get all levels successfully (cached)', levels: cached });
      }
      const levels = await levelService.getAllLevels();
      memoryCache.set('levels_all', levels);
      return res.status(200).json({ message: 'Get all levels successfully', levels });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }

  async createLevel(req: Request, res: Response): Promise<Response> {
    try {
      const { levelName, level, image } = req.body as CreateLevelDto;
      if (!levelName || !level) {
        return res.status(400).json({ message: 'Level name and level are required' });
      }
      const newLevel = await levelService.createLevel({ levelName, level, image });
      memoryCache.clear(); // Invalidate cache on update
      return res.status(201).json({ message: 'Create level successfully', level: newLevel });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateLevel(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const updatedLevel = await levelService.updateLevel(id, req.body);
      if (!updatedLevel) {
        return res.status(404).json({ message: 'Level not found to update' });
      }
      memoryCache.clear(); // Invalidate cache on update
      return res.status(200).json({ message: 'Update level successfully', level: updatedLevel });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteLevel(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const isDeleted = await levelService.deleteLevel(id);
      if (!isDeleted) {
        return res.status(404).json({ message: 'Level not found to delete' });
      }
      memoryCache.clear(); // Invalidate cache on update
      return res.status(200).json({ message: 'Delete level successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async uploadImage(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const imageUrl = await uploadToSupabase(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      return res.status(200).json({ message: 'Upload image successfully', imageUrl });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new LevelController();