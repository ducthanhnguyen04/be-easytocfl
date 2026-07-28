import { Request, Response } from 'express';
import exampleService from '../../services/exampleService';
import { CreateExampleDto } from '../../types';

class ExampleController {
  async getAllExamples(_req: Request, res: Response): Promise<Response> {
    try {
      const examples = await exampleService.getAllExamples();
      return res.json({ message: 'Get all examples successfully', examples });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async createExample(req: Request, res: Response): Promise<Response> {
    try {
      const { example, meaning, pinyin, audioUrl, vocabularyId, grammarId } = req.body as CreateExampleDto;
      if (!example || !meaning || !pinyin) {
        return res.status(400).json({ message: 'Example, meaning and pinyin are required' });
      }
      const newExample = await exampleService.createExample({ example, meaning, pinyin, audioUrl, vocabularyId, grammarId });
      return res.json({ message: 'Create example successfully', example: newExample });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async updateExample(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const { example, meaning, pinyin, audioUrl, vocabularyId, grammarId } = req.body as CreateExampleDto;
      if (!example || !meaning || !pinyin) {
        return res.status(400).json({ message: 'Example, meaning and pinyin are required' });
      }
      const updatedExample = await exampleService.updateExample(id, { example, meaning, pinyin, audioUrl, vocabularyId, grammarId });
      return res.json({ message: 'Update example successfully', example: updatedExample });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteExample(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const deleted = await exampleService.deleteExample(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Example not found' });
      }
      return res.json({ message: 'Delete example successfully' });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  async importExamples(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Excel file is required' });
      }

      const grammarIdStr = (req.body.grammarId || req.query.grammarId) as string | undefined;
      const defaultGrammarId = grammarIdStr ? parseInt(grammarIdStr, 10) : undefined;

      const vocabIdStr = (req.body.vocabularyId || req.query.vocabularyId) as string | undefined;
      const defaultVocabId = vocabIdStr ? parseInt(vocabIdStr, 10) : undefined;

      const importedExamples = await exampleService.importExamplesFromBuffer(
        req.file.buffer,
        defaultGrammarId,
        defaultVocabId
      );

      return res.json({
        message: 'Import examples successfully',
        count: importedExamples.length,
        examples: importedExamples,
      });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ message: err.message });
    }
  }
}

export default new ExampleController();