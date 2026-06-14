import { Router } from 'express';
import LevelController from '../controllers/levelController/levelController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';

const router = Router();

router.get('/get-all', LevelController.getAllLevels.bind(LevelController));
router.post('/create', LevelController.createLevel.bind(LevelController));
router.put('/update/:id', LevelController.updateLevel.bind(LevelController));
router.delete('/delete/:id', LevelController.deleteLevel.bind(LevelController));

export default router;

