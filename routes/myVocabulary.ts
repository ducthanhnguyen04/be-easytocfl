import { Router } from 'express';
import MyVocabularyController from '../controllers/myVocabularyController/myVocabularyController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Apply authMiddleware to all routes here
router.use(authMiddleware);

// Vocabulary list endpoints
router.get('/', MyVocabularyController.getVocabularyLists.bind(MyVocabularyController));
router.post('/', MyVocabularyController.createVocabularyList.bind(MyVocabularyController));
router.get('/:listId', MyVocabularyController.getVocabularyListDetail.bind(MyVocabularyController));
router.put('/:listId', MyVocabularyController.updateVocabularyList.bind(MyVocabularyController));
router.delete('/:listId', MyVocabularyController.deleteVocabularyList.bind(MyVocabularyController));

// Vocabulary item endpoints within a list
router.post('/:listId/items', MyVocabularyController.addVocabularyItem.bind(MyVocabularyController));
router.put('/items/:itemId', MyVocabularyController.updateVocabularyItem.bind(MyVocabularyController));
router.delete('/items/:itemId', MyVocabularyController.deleteVocabularyItem.bind(MyVocabularyController));

export default router;
