import { Request, Response } from 'express';
import vocabularyService from '../../services/vocabularyService';
import { CreateVocabularyDto } from '../../types';
import { memoryCache } from '../../utils/memoryCache';

class VocabularyController {
  async getAllVocabularies(_req: Request, res: Response): Promise<Response> {
    try {
      const cached = memoryCache.get<any>('vocabularies_all');
      if (cached) {
        return res.json({ message: 'Get all vocabularies successfully (cached)', vocabularies: cached });
      }
      const vocabularies = await vocabularyService.getAllVocabularies();
      memoryCache.set('vocabularies_all', vocabularies);
      return res.json({ message: 'Get all vocabularies successfully', vocabularies });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createVocabulary(req: Request, res: Response): Promise<Response> {
    try {
      const { vocabulary, meaning, englishMeaning, pinyin, audioUrl, lessonId } = req.body as CreateVocabularyDto;
      if (!vocabulary || !meaning || !englishMeaning || !pinyin) {
        return res.status(400).json({ message: 'All are required' });
      }
      const newVocabulary = await vocabularyService.createVocabulary({ vocabulary, meaning, englishMeaning, pinyin, audioUrl, lessonId });
      memoryCache.clear(); // Invalidate cache on update
      return res.json({ message: 'Create vocabulary successfully', vocabulary: newVocabulary });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateVocabulary(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const { vocabulary, meaning, englishMeaning, pinyin, audioUrl, lessonId } = req.body as CreateVocabularyDto;
      if (!vocabulary || !meaning || !englishMeaning || !pinyin) {
        return res.status(400).json({ message: 'All are required' });
      }
      const updatedVocabulary = await vocabularyService.updateVocabulary(id, { vocabulary, meaning, englishMeaning, pinyin, audioUrl, lessonId });
      memoryCache.clear(); // Invalidate cache on update
      return res.json({ message: 'Update vocabulary successfully', vocabulary: updatedVocabulary });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteVocabulary(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const deleted = await vocabularyService.deleteVocabulary(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Vocabulary not found' });
      }
      memoryCache.clear(); // Invalidate cache on update
      return res.json({ message: 'Delete vocabulary successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async getVocabularyByLessonId(req: Request, res: Response): Promise<Response> {
    try {
      const lessonId = req.query.lessonId as string;
      if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
      }
      const cacheKey = `vocabulary_lesson_${lessonId}`;
      const cached = memoryCache.get<any>(cacheKey);
      if (cached) {
        return res.json({ message: 'Get vocabularies by lesson ID successfully (cached)', vocabularies: cached });
      }
      const vocabularies = await vocabularyService.getVocabularyByLessonId(lessonId);
      memoryCache.set(cacheKey, vocabularies);
      return res.json({ message: 'Get vocabularies by lesson ID successfully', vocabularies });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async importVocabulary(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Excel file is required' });
      }

      const lessonIdStr = (req.body.lessonId || req.query.lessonId) as string | undefined;
      const defaultLessonId = lessonIdStr ? parseInt(lessonIdStr, 10) : undefined;

      const importedVocabularies = await vocabularyService.importVocabulariesFromBuffer(
        req.file.buffer,
        defaultLessonId
      );

      memoryCache.clear(); // Invalidate cache on update
      return res.json({
        message: 'Import vocabulary successfully',
        count: importedVocabularies.length,
        vocabularies: importedVocabularies,
      });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ message: err.message });
    }
  }
}

export default new VocabularyController();