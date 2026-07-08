import { Router } from 'express';
import userController from '../controllers/userController/userController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';


const router = Router();

router.get('/check-premium', authMiddleware, userController.checkIsPremium);
router.put('/change-profile', authMiddleware, userController.updateProfile.bind(userController));
router.put('/change-password', authMiddleware, userController.changePassword.bind(userController));
router.post('/streak-heartbeat', authMiddleware, userController.streakHeartbeat.bind(userController));

// Admin routes
router.get('/admin/get-all', authMiddleware, checkAdmin, userController.getAllUsers.bind(userController));
router.put('/admin/update-role/:id', authMiddleware, checkAdmin, userController.updateUserRole.bind(userController));
router.put('/admin/toggle-premium/:id', authMiddleware, checkAdmin, userController.togglePremium.bind(userController));
router.delete('/admin/delete/:id', authMiddleware, checkAdmin, userController.deleteUser.bind(userController));


export default router;

