import { Router } from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { UserValidations } from './user.validation';
import { authGuard } from '../../middleware/authGuard';

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
userRouter.get('/', authGuard(), userController.getAllUsers);
userRouter.post(
  '/refresh-token',
  validateRequest({ cookies: UserValidations.refreshTokenValidationSchema }),
  userController.refreshToken,
);
