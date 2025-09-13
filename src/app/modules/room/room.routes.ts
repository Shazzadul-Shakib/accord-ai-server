import { Router } from 'express';
import { roomController } from './room.controller';
import { authGuard } from '../../middleware/authGuard';

export const roomRouter = Router();

roomRouter.get('/', authGuard(), roomController.getAllUserChatRoom);
roomRouter.delete('/:roomId', authGuard(), roomController.deleteChatRoom);
roomRouter.get(
  '/:roomId/messages',
  authGuard(),
  roomController.getAllMessagesFromChatRoom,
);
roomRouter.get(
  '/:roomId/summary',
  authGuard(),
  roomController.summarizeAllMessagesFromChatRoom,
);
