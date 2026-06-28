import { Router } from 'express';
import RadicalController from '../controllers/radicalController/radicalController';

const router = Router();

router.get('/get-all', RadicalController.getAllRadicals.bind(RadicalController));
router.post('/create', RadicalController.createRadical.bind(RadicalController));
router.put('/update/:id', RadicalController.updateRadical.bind(RadicalController));
router.delete('/delete/:id', RadicalController.deleteRadical.bind(RadicalController));

export default router;
