import { Router } from 'express';
import LessonController from '../controllers/lessonController/lessonController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';

const router = Router();

router.get('/get-all', LessonController.getAllLessons.bind(LessonController));
router.post('/create', LessonController.createLesson.bind(LessonController));
router.put('/update/:id', LessonController.updateLesson.bind(LessonController));
router.delete('/delete/:id', LessonController.deleteLesson.bind(LessonController));
router.get('/get-lesson-by-level-id', LessonController.getLessonByLevelId.bind(LessonController));

export default router;

