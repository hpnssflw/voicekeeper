import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, pick: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[pick]);
    if (!result.success) {
      return res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: result.error.flatten() } });
    }
    (req as any)[pick] = result.data;
    next();
  };
}


