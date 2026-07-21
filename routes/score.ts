import { Router } from 'express';
import scoreController from '../controllers/scoreController/scoreController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/quiz', authMiddleware, scoreController.submitQuiz.bind(scoreController));
router.post('/lesson', authMiddleware, scoreController.completeLesson.bind(scoreController));
router.post('/exam', authMiddleware, scoreController.submitExam.bind(scoreController));
router.get('/leaderboard', scoreController.getLeaderboard.bind(scoreController));

export default router;
