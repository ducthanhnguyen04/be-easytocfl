import { Router } from 'express';
import DialogueController from '../controllers/dialogueController/dialogueController';
import { requirePremium } from '../middlewares/checkPremiumAccess';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/get-all', DialogueController.getAllDialogues.bind(DialogueController));
router.get('/get-by-lesson-id', authMiddleware, requirePremium, DialogueController.getDialogueByLessonId.bind(DialogueController));
router.post('/create', DialogueController.createDialogue.bind(DialogueController));
router.put('/update/:id', DialogueController.updateDialogue.bind(DialogueController));
router.delete('/delete/:id', DialogueController.deleteDialogue.bind(DialogueController));

export default router;
