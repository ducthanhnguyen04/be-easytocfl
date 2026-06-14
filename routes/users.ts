import { Router } from 'express';
import userController from '../controllers/userController/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/check-premium', authMiddleware, userController.checkIsPremium);
router.put('/profile', authMiddleware, userController.updateProfile.bind(userController));

export default router;

