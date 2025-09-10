import { Router } from 'express';
import { roomController } from './room.controller';
import { authGuard } from '../../middleware/authGuard';

export const roomRouter = Router();

roomRouter.delete('/:roomId', authGuard(), roomController.deleteChatRoom);
roomRouter.get(
  '/:roomId',
  authGuard(),
  roomController.getAllMessagesFromChatRoom,
);
roomRouter.get(
  '/:roomId/summary',
  authGuard(),
  roomController.summarizeAllMessagesFromChatRoom,
);
