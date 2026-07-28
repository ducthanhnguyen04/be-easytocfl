import { Router } from 'express';
import ExampleController from '../controllers/exampleController/exampleController';
import authMiddleware from '../middlewares/authMiddleware';
import checkAdmin from '../middlewares/checkAdmin';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-all', ExampleController.getAllExamples.bind(ExampleController));
router.post('/create', ExampleController.createExample.bind(ExampleController));
router.put('/update/:id', ExampleController.updateExample.bind(ExampleController));
router.delete('/delete/:id', ExampleController.deleteExample.bind(ExampleController));
router.post('/import', upload.single('file'), ExampleController.importExamples.bind(ExampleController));

export default router;

