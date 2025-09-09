import { JwtPayload } from 'jsonwebtoken';
import { MessageModel } from './message.model';
import { sendMessageToRoom } from '../../utils/socketUtils';
import { ChatRoomModel } from '../room/room.model';
import AppError from '../../errorHandlers/appError';
import httpStatus from 'http-status';

// ----- Send message to room service ----- //
const sendMessageToRoomService = async (
  body: { text: string; isTyping: boolean },
  params: { roomId: string },
  user: JwtPayload,
) => {
  const { roomId } = params;
  const { text, isTyping } = body;
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
  // //   ----- send message realtime ----- //
  // sendMessageToRoom(roomId, userId, text, isTyping);
  // 🚨 If this is just typing event → do NOT save to DB
  if (text === '' && typeof isTyping === 'boolean') {
    sendMessageToRoom(roomId, userId, '', isTyping);
    return { roomId, sender: userId, isTyping }; // return minimal
  }

  // Otherwise → it's a real message
  const result = await MessageModel.create({
    roomId,
    sender: userId,
    text,
    isTyping: false, // real message, not typing
  });

  sendMessageToRoom(roomId, userId, text, false);

  return result;
};

// ----- delete message from room service ----- //
const deleteMessageFromRoomService = async (
  params: { roomId: string; messageId: string },
  user: JwtPayload,
) => {
  const { roomId, messageId } = params;
  const { userId } = user;

  // ----- Check if chat room exists ----- //
  const chatRoom = await ChatRoomModel.findById(roomId).lean();
  if (!chatRoom) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat room not found');
  }

  // ----- Check if user is a member of the room ----- //
  if (!chatRoom.members.some(m => m.toString() === userId.toString())) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not a member of this room',
    );
  }

  // ----- Check if message exists ----- //
  const message = await MessageModel.findById(messageId).lean();
  if (!message) {
    throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
  }

  // ----- Check if user is the sender of the message ----- //
  if (message.sender.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not the sender of this message',
    );
  }

  // ----- Delete the message ----- //
  const result = await MessageModel.findByIdAndDelete(messageId);

  return result;
};

// ----- update message from room service ----- //
const updateMessageFromRoomService = async (
  data: { text: string },
  params: { roomId: string; messageId: string },
  user: JwtPayload,
) => {
  const { text } = data;
  const { roomId, messageId } = params;
  const { userId } = user;

  // ----- Check if chat room exists ----- //
  const chatRoom = await ChatRoomModel.findById(roomId).lean();
  if (!chatRoom) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat room not found');
  }

  // -----  Check if user is a member of the room ----- //
  if (!chatRoom.members.some(m => m.toString() === userId.toString())) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not a member of this room',
    );
  }

  // ----- Check if message exists ----- //
  const message = await MessageModel.findById(messageId).lean();
  if (!message) {
    throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
  }

  // ----- Check if user is the sender of the message ----- //
  if (message.sender.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not the sender of this message',
    );
  }

  // -----  update the message ----- //
  const result = await MessageModel.findByIdAndUpdate(
    messageId,
    { text },
    { new: true },
  );

  return result;
};

export const messageService = {
  sendMessageToRoomService,
  deleteMessageFromRoomService,
  updateMessageFromRoomService,
};
