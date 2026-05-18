import { Request, Response } from 'express';
import levelService from '../../services/levelService';
import { CreateLevelDto, AppError } from '../../types';

class LevelController {
  async getAllLevels(_req: Request, res: Response): Promise<Response> {
    try {
      const levels = await levelService.getAllLevels();
      return res.status(200).json({ message: 'Get all levels successfully', levels });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }

  async createLevel(req: Request, res: Response): Promise<Response> {
    try {
      const { levelName, level } = req.body as CreateLevelDto;
      if (!levelName || !level) {
        return res.status(400).json({ message: 'Level name and level are required' });
      }
      const newLevel = await levelService.createLevel({ levelName, level });
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
      return res.status(200).json({ message: 'Delete level successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new LevelController();