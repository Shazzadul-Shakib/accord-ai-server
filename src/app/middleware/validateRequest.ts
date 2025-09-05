import { ZodObject } from 'zod';
import { catchAsync } from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

export const validateRequest = (
  schema: ZodObject | { body?: ZodObject; cookies?: ZodObject },
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    for (const [key, value] of Object.entries(schema)) {
      if (value) {
        await value.parseAsync(req[key as keyof Request]);
      }
    }
    next();
  });
};
