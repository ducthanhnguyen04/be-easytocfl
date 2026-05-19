import { Router } from 'express';
import CommentController from '../controllers/commentController/commentController';

const router = Router();

router.get('/get-all', CommentController.getAllComments.bind(CommentController));
router.post('/create', CommentController.createComment.bind(CommentController));

export default router;
