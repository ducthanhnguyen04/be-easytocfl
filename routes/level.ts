import { Router } from 'express';
import LevelController from '../controllers/levelController/levelController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-all', LevelController.getAllLevels.bind(LevelController));
router.post('/create', LevelController.createLevel.bind(LevelController));
router.put('/update/:id', LevelController.updateLevel.bind(LevelController));
router.delete('/delete/:id', LevelController.deleteLevel.bind(LevelController));
router.post('/upload-image', upload.single('image'), LevelController.uploadImage.bind(LevelController));

export default router;

