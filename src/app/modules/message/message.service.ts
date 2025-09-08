
import { JwtPayload } from 'jsonwebtoken';
import { MessageModel } from './message.model';
import { sendMessageToRoom } from '../../utils/socketUtils';
import { ChatRoomModel } from '../room/room.model';
import AppError from '../../errorHandlers/appError';
import httpStatus from 'http-status';

// ----- Send message to room service ----- //
const sendMessageToRoomService = async (
  body: { text: string },
  params: { roomId: string },
  user: JwtPayload,
) => {
  const { roomId } = params;
  const { text } = body;
  const { userId } = user;

  // 1. Check if chat room exists
  const chatRoom = await ChatRoomModel.findById(roomId).lean();
  if (!chatRoom) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat room not found');
  }

  // 2. Check if user is a member of the room
  if (!chatRoom.members.some(m => m.toString() === userId.toString())) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not a member of this room',
    );
  }

  const newMessage = {
    roomId,
    sender: userId,
    text,
  };

  const result = await MessageModel.create(newMessage);

  //   ----- send message realtime ----- //
  sendMessageToRoom(roomId, userId, text);

  return result;
};

export const messageService = {
  sendMessageToRoomService,
};
