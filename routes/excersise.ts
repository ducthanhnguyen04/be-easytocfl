import { Router } from 'express';
import ExcersiseController from '../controllers/excersiseController/excersiseController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';

const router = Router();

router.get('/get-all', ExcersiseController.getAllExcersises.bind(ExcersiseController));
router.post('/create', ExcersiseController.createExcersise.bind(ExcersiseController));
router.put('/update/:id', ExcersiseController.updateExcersise.bind(ExcersiseController));
router.delete('/delete/:id', ExcersiseController.deleteExcersise.bind(ExcersiseController));
router.get('/get-excersises-by-grammar-id', ExcersiseController.getExcersisesByGrammarId.bind(ExcersiseController));

export default router;
