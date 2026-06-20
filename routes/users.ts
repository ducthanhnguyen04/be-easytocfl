import { Router } from 'express';
import userController from '../controllers/userController/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/check-premium', authMiddleware, userController.checkIsPremium);
router.put('/change-profile', authMiddleware, userController.updateProfile.bind(userController));
router.put('/change-password', authMiddleware, userController.changePassword.bind(userController));

export default router;

