import { Router } from 'express';
import { notificationController } from './notification.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { notificationValidations } from './notification.validation';

export const notificationRouter = Router();

notificationRouter.post(
  '/create',
  validateRequest({
    body: notificationValidations.notificationValidationSchema,
  }),
  notificationController.cretaeNotification,
);
