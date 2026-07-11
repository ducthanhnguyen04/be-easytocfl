import { Request, Response } from 'express';
import dialogueService from '../../services/dialogueService';
import { CreateDialogueDto } from '../../types';
import { memoryCache } from '../../utils/memoryCache';

class DialogueController {
  async getAllDialogues(_req: Request, res: Response): Promise<Response> {
    try {
      const cached = memoryCache.get<any>('dialogues_all');
      if (cached) {
        return res.json({ message: 'Get all dialogues successfully (cached)', dialogues: cached });
      }
      const dialogues = await dialogueService.getAllDialogues();
      memoryCache.set('dialogues_all', dialogues);
      return res.json({ message: 'Get all dialogues successfully', dialogues });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async getDialogueByLessonId(req: Request, res: Response): Promise<Response> {
    try {
      const lessonId = req.query.lessonId as string;
      if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
      }
      const cacheKey = `dialogue_lesson_${lessonId}`;
      const cached = memoryCache.get<any>(cacheKey);
      if (cached) {
        return res.json({ message: 'Get dialogue by lesson ID successfully (cached)', dialogue: cached });
      }
      const dialogue = await dialogueService.getDialogueByLessonId(lessonId);
      memoryCache.set(cacheKey, dialogue);
      return res.json({ message: 'Get dialogue by lesson ID successfully', dialogue });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createDialogue(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId, header, illustrationUrl, lines } = req.body as CreateDialogueDto;
      if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
      }
      const newDialogue = await dialogueService.createDialogue({ lessonId, header, illustrationUrl, lines });
      memoryCache.clear(); // Invalidate cache on change
      return res.json({ message: 'Create dialogue successfully', dialogue: newDialogue });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateDialogue(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const { lessonId, header, illustrationUrl, lines } = req.body as CreateDialogueDto;
      if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
      }
      const updatedDialogue = await dialogueService.updateDialogue(id, { lessonId, header, illustrationUrl, lines });
      if (!updatedDialogue) {
        return res.status(404).json({ message: 'Dialogue not found' });
      }
      memoryCache.clear(); // Invalidate cache on change
      return res.json({ message: 'Update dialogue successfully', dialogue: updatedDialogue });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteDialogue(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const deleted = await dialogueService.deleteDialogue(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Dialogue not found' });
      }
      memoryCache.clear(); // Invalidate cache on change
      return res.json({ message: 'Delete dialogue successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new DialogueController();
