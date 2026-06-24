import { Router } from 'express';
import VocabularyController from '../controllers/vocabularyController/vocabularyController';
import { requirePremium } from '../middlewares/checkPremiumAccess';
import authMiddleware from '../middlewares/authMiddleware';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-all', VocabularyController.getAllVocabularies.bind(VocabularyController));
router.post('/create', VocabularyController.createVocabulary.bind(VocabularyController));
router.put('/update/:id', VocabularyController.updateVocabulary.bind(VocabularyController));
router.delete('/delete/:id', VocabularyController.deleteVocabulary.bind(VocabularyController));
router.get('/get-vocabulary-by-lesson-id', authMiddleware, requirePremium, VocabularyController.getVocabularyByLessonId.bind(VocabularyController));
router.post('/import', upload.single('file'), VocabularyController.importVocabulary.bind(VocabularyController));

export default router;
