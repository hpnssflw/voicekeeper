import type { NextFunction, Request, Response } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
  // TODO: verify JWT and set req.user
  next();
}


