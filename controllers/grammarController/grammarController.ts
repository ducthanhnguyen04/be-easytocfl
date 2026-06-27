import { Request, Response } from 'express';
import grammarService from '../../services/grammarService';
import { CreateGrammarDto } from '../../types';

class GrammarController {
  async getAllGrammars(_req: Request, res: Response): Promise<Response> {
    try {
      const grammars = await grammarService.getAllGrammars();
      return res.json({ message: 'Get all grammars successfully', grammars });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async getGrammarsByLessonId(req: Request, res: Response): Promise<Response> {
    try {
      const lessonId = req.query.lessonId as string;
      if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
      }
      const grammars = await grammarService.getGrammarsByLessonId(lessonId);
      return res.json({ message: 'Get grammars by lesson ID successfully', grammars });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createGrammar(req: Request, res: Response): Promise<Response> {
    try {
      const { grammar, structure, usage, definition, notes, lessonId } = req.body as CreateGrammarDto;
      if (!grammar || !structure || !usage || !definition || !lessonId) {
        return res.status(400).json({ message: 'All are required' });
      }
      const newGrammar = await grammarService.createGrammar({ grammar, structure, usage, definition, notes, lessonId });
      return res.json({ message: 'Create grammar successfully', grammar: newGrammar });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateGrammar(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const { grammar, structure, usage, definition, notes, lessonId } = req.body as CreateGrammarDto;
      if (!grammar || !structure || !usage || !definition || !lessonId) {
        return res.status(400).json({ message: 'All are required' });
      }
      const updatedGrammar = await grammarService.updateGrammar(id, { grammar, structure, usage, definition, notes, lessonId });
      return res.json({ message: 'Update grammar successfully', grammar: updatedGrammar });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteGrammar(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const deleted = await grammarService.deleteGrammar(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Grammar not found' });
      }
      return res.json({ message: 'Delete grammar successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new GrammarController();