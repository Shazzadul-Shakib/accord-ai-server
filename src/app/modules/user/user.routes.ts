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
userRouter.post('/logout', userController.logoutUser);
userRouter.get('/', authGuard(), userController.getAllUsers);
userRouter.get('/logged-user', authGuard(), userController.getLoggedUser);
userRouter.post(
  '/refresh-token',
  validateRequest({ cookies: UserValidations.refreshTokenValidationSchema }),
  userController.refreshToken,
);
userRouter.patch(
  '/update-profile',
  authGuard(),
  validateRequest({ body: UserValidations.updateUserProfileValidationSchema }),
  userController.updateProfile,
);
