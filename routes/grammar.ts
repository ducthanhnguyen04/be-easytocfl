import { Router } from 'express';
import GrammarController from '../controllers/grammarController/grammarController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';
import { requirePremium } from '../middlewares/checkPremiumAccess';

const router = Router();

router.get('/get-all', GrammarController.getAllGrammars.bind(GrammarController));
router.post('/create', GrammarController.createGrammar.bind(GrammarController));
router.put('/update/:id', GrammarController.updateGrammar.bind(GrammarController));
router.delete('/delete/:id', GrammarController.deleteGrammar.bind(GrammarController));
router.get('/get-grammar-by-lesson-id', authMiddleware, requirePremium, GrammarController.getGrammarsByLessonId.bind(GrammarController));

export default router;

