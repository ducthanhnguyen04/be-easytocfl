import { Router, Request, Response, NextFunction } from 'express';
import { memoryCache } from '../utils/memoryCache';

const router = Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

router.get('/cache-version', (_req: Request, res: Response) => {
  res.status(200).json({ version: memoryCache.getVersion() });
});

export default router;
