import { Router } from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { UserValidations } from './user.validation';

export const userRouter = Router();

userRouter.post(
  '/register',
  validateRequest({ body: UserValidations.userValidationSchema }),
  userController.registerUser,
);
userRouter.post(
  '/login',
  validateRequest({ body: UserValidations.userLoginValidatinSchema }),
  userController.loginUser,
);
userRouter.post(
  '/refresh-token',
  validateRequest({ cookies: UserValidations.refreshTokenValidationSchema }),
  userController.refreshToken,
);
