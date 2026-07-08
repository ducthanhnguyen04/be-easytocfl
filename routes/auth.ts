import { Router, Response } from 'express';
import authController from '../controllers/authController/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { AuthRequest } from '../types';
import db from '../models';

const router = Router();
const User = db.User;

router.post('/login', authController.login.bind(authController));
router.post('/google-login', authController.googleLogin.bind(authController));
router.post('/register', authController.register.bind(authController));

router.post('/logout', authController.logout.bind(authController));
router.get('/check', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      message: 'Authenticated',
      user: {
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isPremium: !!user.isPremium,
        isGoogleLogin: req.user?.isGoogleLogin,
        streakCount: user.streakCount || 0,
        studyTimeToday: user.studyTimeToday || 0,
        lastStudyDate: user.lastStudyDate,
        lastHeartbeatDate: user.lastHeartbeatDate,
      }
    });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
