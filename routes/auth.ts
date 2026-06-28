import { Router, Response } from 'express';
import authController from '../controllers/authController/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { AuthRequest } from '../types';

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/google-login', authController.googleLogin.bind(authController));
router.post('/register', authController.register.bind(authController));

router.post('/logout', authController.logout.bind(authController));
router.get('/check', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Authenticated', user: req.user });
});

export default router;
