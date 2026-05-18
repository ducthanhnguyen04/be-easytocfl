import { Router } from 'express';
import GrammarController from '../controllers/grammarController/grammarController';

const router = Router();

router.get('/get-all', GrammarController.getAllGrammars.bind(GrammarController));
router.post('/create', GrammarController.createGrammar.bind(GrammarController));
router.put('/update/:id', GrammarController.updateGrammar.bind(GrammarController));
router.delete('/delete/:id', GrammarController.deleteGrammar.bind(GrammarController));

export default router;
