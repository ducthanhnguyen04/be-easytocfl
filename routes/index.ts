import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

export default router;
