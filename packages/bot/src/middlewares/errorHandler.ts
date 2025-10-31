import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || 500;
  const code = err?.code || 'INTERNAL_ERROR';
  const message = err?.message || 'Internal Server Error';
  const details = err?.details;

  res.status(status).json({ data: null, error: { code, message, details } });
}


