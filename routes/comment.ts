import { Router } from 'express';
import CommentController from '../controllers/commentController/commentController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';

const router = Router();

router.get('/get-all', CommentController.getAllComments.bind(CommentController));
router.post('/create', CommentController.createComment.bind(CommentController));
router.delete('/delete/:id', authMiddleware, checkAdmin, CommentController.deleteComment.bind(CommentController));

export default router;
