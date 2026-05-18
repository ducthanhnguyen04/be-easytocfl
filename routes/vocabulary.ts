import { Router } from 'express';
import VocabularyController from '../controllers/vocabularyController/vocabularyController';

const router = Router();

router.get('/get-all', VocabularyController.getAllVocabularies.bind(VocabularyController));
router.post('/create', VocabularyController.createVocabulary.bind(VocabularyController));
router.put('/update/:id', VocabularyController.updateVocabulary.bind(VocabularyController));
router.delete('/delete/:id', VocabularyController.deleteVocabulary.bind(VocabularyController));
router.get('/get-vocabulary-by-lesson-id', VocabularyController.getVocabularyByLessonId.bind(VocabularyController));

export default router;
