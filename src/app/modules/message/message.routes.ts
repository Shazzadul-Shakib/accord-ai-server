import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard';
import { validateRequest } from '../../middleware/validateRequest';
import { messageValidations } from './message.validation';
import { messageController } from './message.controller';

export const messageRouter = Router();

messageRouter.post(
  '/:roomId',
  authGuard(),
  validateRequest({ body: messageValidations.messageValidationSchema }),
  messageController.sendMessageToRoom,
);

messageRouter.delete(
  '/:roomId/:messageId',
  authGuard(),
  messageController.deleteMessageFromRoom,
);
