import { Router, Response, NextFunction } from 'express';
import writingSheetController from '../controllers/writingSheetController/writingSheetController';
import authMiddleware from '../middlewares/authMiddleware';
import { AuthRequest } from '../types';

const router = Router();

// Optional auth wrapper middleware (extracts req.user if token is present, but doesn't block unauthenticated users)
const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    authMiddleware(req, res, () => {
      next();
    });
  } catch (e) {
    next();
  }
};

router.get('/', optionalAuthMiddleware, writingSheetController.getWritingSheets.bind(writingSheetController));
router.post('/', optionalAuthMiddleware, writingSheetController.createWritingSheet.bind(writingSheetController));
router.get('/:sheetId', optionalAuthMiddleware, writingSheetController.getWritingSheetDetail.bind(writingSheetController));
router.put('/:sheetId', optionalAuthMiddleware, writingSheetController.updateWritingSheet.bind(writingSheetController));
router.delete('/:sheetId', optionalAuthMiddleware, writingSheetController.deleteWritingSheet.bind(writingSheetController));

router.post('/:sheetId/items', optionalAuthMiddleware, writingSheetController.addWritingSheetItem.bind(writingSheetController));
router.put('/items/:itemId', optionalAuthMiddleware, writingSheetController.updateWritingSheetItem.bind(writingSheetController));
router.delete('/items/:itemId', optionalAuthMiddleware, writingSheetController.deleteWritingSheetItem.bind(writingSheetController));

export default router;
