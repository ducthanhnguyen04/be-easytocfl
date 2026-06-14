import { Router } from 'express';
import ExampleController from '../controllers/exampleController/exampleController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';

const router = Router();

router.get('/get-all', ExampleController.getAllExamples.bind(ExampleController));
router.post('/create', ExampleController.createExample.bind(ExampleController));
router.put('/update/:id', ExampleController.updateExample.bind(ExampleController));
router.delete('/delete/:id', ExampleController.deleteExample.bind(ExampleController));

export default router;

