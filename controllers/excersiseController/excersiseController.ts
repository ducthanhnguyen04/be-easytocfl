import { Request, Response } from 'express';
import excersiseService from '../../services/excersiseService';
import { CreateExcersiseDto, AppError } from '../../types';

class ExcersiseController {
  async getAllExcersises(_req: Request, res: Response): Promise<Response> {
    try {
      const excersises = await excersiseService.getAllExcersises();
      return res.status(200).json({ message: 'Get all exercises successfully', excersises });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async createExcersise(req: Request, res: Response): Promise<Response> {
    try {
      const { title, meaning, englishMeaning, grammarId } = req.body as CreateExcersiseDto;
      if (!title || !meaning || !englishMeaning || !grammarId) {
        return res.status(400).json({ message: 'title, meaning, englishMeaning, and grammarId are required' });
      }
      const newExcersise = await excersiseService.createExcersise({
        title,
        meaning,
        englishMeaning,
        grammarId,
      });
      return res.status(201).json({ message: 'Create exercise successfully', excersise: newExcersise });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async updateExcersise(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const updatedExcersise = await excersiseService.updateExcersise(id, req.body);
      if (!updatedExcersise) {
        return res.status(404).json({ message: 'Exercise not found to update' });
      }
      return res.status(200).json({ message: 'Update exercise successfully', excersise: updatedExcersise });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async deleteExcersise(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const isDeleted = await excersiseService.deleteExcersise(id);
      if (!isDeleted) {
        return res.status(404).json({ message: 'Exercise not found to delete' });
      }
      return res.status(200).json({ message: 'Delete exercise successfully' });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async getExcersisesByGrammarId(req: Request, res: Response): Promise<Response> {
    try {
      const grammarId = req.query.grammarId as string;
      if (!grammarId) {
        return res.status(400).json({ message: 'grammarId query parameter is required' });
      }
      const excersises = await excersiseService.getExcersisesByGrammarId(grammarId);
      return res.status(200).json({ message: 'Get exercises by grammar ID successfully', excersises });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

export default new ExcersiseController();
