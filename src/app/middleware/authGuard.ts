import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../errorHandlers/appError';
import {status} from 'http-status';
import { UserModel } from '../modules/user/user.model';

export const authGuard = () => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(status.UNAUTHORIZED, 'Unauthorized access!');
    }

    // ----- extract the token from Bearer ----- //
    const token = authHeader.split(' ')[1];

    // ----- if token is not sent ----- //
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'Unauthorized access!');
    }

    // ----- Verify the JWT token ----- //
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch {
      throw new AppError(status.UNAUTHORIZED, 'Invalid or expired token!');
    }

    const { email } = decoded;

    // ----- check existance of user ----- //
    const user = await UserModel.isUserExistByEmail(email);
    if (!user) {
      throw new AppError(status.NOT_FOUND, 'User not found');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
