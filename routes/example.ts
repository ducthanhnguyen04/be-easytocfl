import { Router } from 'express';
import ExampleController from '../controllers/exampleController/exampleController';

const router = Router();

router.get('/get-all', ExampleController.getAllExamples.bind(ExampleController));
router.post('/create', ExampleController.createExample.bind(ExampleController));
router.put('/update/:id', ExampleController.updateExample.bind(ExampleController));
router.delete('/delete/:id', ExampleController.deleteExample.bind(ExampleController));

export default router;
