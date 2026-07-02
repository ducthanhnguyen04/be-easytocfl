import { Request, Response } from 'express';
import radicalService from '../../services/radicalService';
import { CreateRadicalDto } from '../../types';
import { memoryCache } from '../../utils/memoryCache';

class RadicalController {
  async getAllRadicals(_req: Request, res: Response): Promise<Response> {
    try {
      const cached = memoryCache.get<any>('radicals_all');
      if (cached) {
        return res.status(200).json({ message: 'Get all radicals successfully (cached)', radicals: cached });
      }
      const radicals = await radicalService.getAllRadicals();
      memoryCache.set('radicals_all', radicals);
      return res.status(200).json({ message: 'Get all radicals successfully', radicals });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createRadical(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;

      if (Array.isArray(body)) {
        if (body.length === 0) {
          return res.status(400).json({ message: 'Array of radicals cannot be empty' });
        }

        for (let i = 0; i < body.length; i++) {
          const { radical, pinyin, meaning, englishMeaning, stroke } = body[i];
          if (!radical || !pinyin || !meaning || !englishMeaning || !stroke) {
            return res.status(400).json({
              message: `radical, pinyin, meaning, englishMeaning, and stroke are required at index ${i}`
            });
          }
        }

        const newRadicals = await radicalService.createRadical(body);
        memoryCache.clear(); // Invalidate cache on update
        return res.status(201).json({ message: 'Create radicals successfully', radicals: newRadicals });
      } else {
        const { radical, pinyin, meaning, englishMeaning, profoundMeaning, example, stroke } = body as CreateRadicalDto;
        if (!radical || !pinyin || !meaning || !englishMeaning || !stroke) {
          return res.status(400).json({ message: 'radical, pinyin, meaning, englishMeaning, and stroke are required' });
        }
        const newRadical = await radicalService.createRadical({
          radical,
          pinyin,
          meaning,
          englishMeaning,
          profoundMeaning,
          example,
          stroke
        });
        memoryCache.clear(); // Invalidate cache on update
        return res.status(201).json({ message: 'Create radical successfully', radical: newRadical });
      }
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateRadical(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const updatedRadical = await radicalService.updateRadical(id, req.body);
      if (!updatedRadical) {
        return res.status(404).json({ message: 'Radical not found to update' });
      }
      memoryCache.clear(); // Invalidate cache on update
      return res.status(200).json({ message: 'Update radical successfully', radical: updatedRadical });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteRadical(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const isDeleted = await radicalService.deleteRadical(id);
      if (!isDeleted) {
        return res.status(404).json({ message: 'Radical not found to delete' });
      }
      memoryCache.clear(); // Invalidate cache on update
      return res.status(200).json({ message: 'Delete radical successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new RadicalController();
