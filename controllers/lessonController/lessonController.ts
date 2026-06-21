import { Request, Response } from 'express';
import LessonService from '../../services/lessonService';
import { CreateLessonDto, UpdateLessonDto } from '../../types';

class LessonController {
  async getAllLessons(_req: Request, res: Response): Promise<Response> {
    try {
      const lessons = await LessonService.getAllLessons();
      return res.json({ message: 'Get all lessons successfully', lessons });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonName, title, slug, levelId, isPremium } = req.body as CreateLessonDto;
      if (!lessonName || !title || !slug || !levelId) {
        return res.status(400).json({ message: 'Lesson name, title, slug and level ID are required' });
      }
      const newLesson = await LessonService.createLesson({ lessonName, title, slug, levelId, isPremium });
      return res.json({ message: 'Create lesson successfully', lesson: newLesson });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonName, title, slug, levelId, isPremium } = req.body as UpdateLessonDto;
      const lessonId = req.params.id as string;
      const lesson = await LessonService.updateLesson(lessonId, { lessonName, title, slug, levelId, isPremium });
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      return res.json({ message: 'Update lesson successfully', lesson });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteLesson(req: Request, res: Response): Promise<Response> {
    try {
      const lessonId = req.params.id as string;
      const deleted = await LessonService.deleteLesson(lessonId);
      if (!deleted) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      return res.json({ message: 'Delete lesson successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async getLessonByLevelId(req: Request, res: Response): Promise<Response> {
    try {
      const levelId = req.query.levelId as string;
      const lessons = await LessonService.getLessonByLevelId(levelId);
      if (!lessons) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      return res.json({ message: 'Get lesson by LevelID successfully', lessons });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new LessonController();