import { Router } from 'express';
import { notificationController } from './notification.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { notificationValidations } from './notification.validation';
import { authGuard } from '../../middleware/authGuard';

export const notificationRouter = Router();

notificationRouter.post(
  '/create',
  validateRequest({
    body: notificationValidations.notificationValidationSchema,
  }),
  notificationController.cretaeNotification,
);

notificationRouter.get(
  '/user-notifications',
  authGuard(),
  notificationController.getUserNotifications,
);

notificationRouter.delete(
  '/:notificationId',
  authGuard(),
  notificationController.deleteNotification,
);
