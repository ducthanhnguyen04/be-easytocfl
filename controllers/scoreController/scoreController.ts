import { Response } from 'express';
import { AuthRequest, AppError } from '../../types';
import scoreService from '../../services/scoreService';

class ScoreController {
  async submitQuiz(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { lessonId, answers, timeSpent } = req.body as {
        lessonId: number;
        answers: Array<{ vocabId: number; chosenTranslation: string }>;
        timeSpent: number;
      };

      if (lessonId === undefined || !answers || timeSpent === undefined) {
        return res.status(400).json({ message: 'lessonId, answers and timeSpent are required.' });
      }

      const result = await scoreService.submitQuiz(userId, lessonId, answers, timeSpent);
      return res.status(200).json({
        message: 'Nộp bài trắc nghiệm thành công!',
        data: result
      });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Đã có lỗi xảy ra.' });
    }
  }

  async completeLesson(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { lessonId, timeSpent } = req.body as {
        lessonId: number;
        timeSpent: number;
      };

      if (lessonId === undefined || timeSpent === undefined) {
        return res.status(400).json({ message: 'lessonId và timeSpent là bắt buộc.' });
      }

      const result = await scoreService.completeLesson(userId, lessonId, timeSpent);
      return res.status(200).json({
        message: 'Hoàn thành bài học thành công!',
        data: result
      });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Đã có lỗi xảy ra.' });
    }
  }

  async submitExam(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { examId, answers, timeSpent } = req.body as {
        examId: string;
        answers: Record<string, number>;
        timeSpent: number;
      };

      if (!examId || !answers || timeSpent === undefined) {
        return res.status(400).json({ message: 'examId, answers và timeSpent là bắt buộc.' });
      }

      const result = await scoreService.submitExam(userId, examId, answers, timeSpent);
      return res.status(200).json({
        message: 'Nộp bài thi thử thành công!',
        data: result
      });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Đã có lỗi xảy ra.' });
    }
  }

  async getLeaderboard(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const result = await scoreService.getLeaderboard();
      return res.status(200).json({
        message: 'Lấy bảng xếp hạng thành công!',
        leaderboard: result
      });
    } catch (error) {
      const err = error as AppError;
      return res.status(err.status || 500).json({ message: err.message || 'Đã có lỗi xảy ra.' });
    }
  }
}

export default new ScoreController();
