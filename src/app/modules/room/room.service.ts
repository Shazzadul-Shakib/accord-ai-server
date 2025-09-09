import { Types } from 'mongoose';
import AppError from '../../errorHandlers/appError';
import { ChatRoomModel } from './room.model';
import httpStatus from 'http-status';
import { TopicRequestModel } from '../topic/topic.model';
import { MessageModel } from '../message/message.model';

// ----- delete chatroom service ----- //
const deleteChatRoomService = async (
  roomId: string,
  userId: Types.ObjectId,
) => {
  // ----- check if the user is a member of the chat room ----- //
  const chatRoom = await ChatRoomModel.findById(roomId);
  if (!chatRoom) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat room not found');
  }
  if (
    !chatRoom.members.some(member => member.toString() === userId.toString())
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is not a member of the chat room',
    );
  }

  const session = await ChatRoomModel.startSession();
  let result;

  try {
    session.startTransaction();

    // ----- Delete the chat room ----- //
    result = await ChatRoomModel.findByIdAndDelete(roomId).session(session);

    if (result?.topic) {
      // ----- Update topic request status to expired ----- //
      await TopicRequestModel.findByIdAndUpdate(
        result.topic,
        { status: 'expired' },
        { session },
      );
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return result;
};

// ----- get all messages from chatroom service ----- //
const getAllMessagesFromChatRoomService = async (
  roomId: string,
  userId: Types.ObjectId,
) => {
  // ----- check if room exists ----- //
  const chatRoom = await ChatRoomModel.findById(roomId);
  if (!chatRoom) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat room not found');
  }

  // ----- check if the user is a member of the chat room ----- //
  if (
    !chatRoom.members.some(member => member.toString() === userId.toString())
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is not a member of the chat room',
    );
  }

  const result = await MessageModel.find({ roomId })
    .populate({
      path: 'sender',
      model: 'User',
      select: '_id name',
    })
    .limit(20);

  return result;
};

export const chatRoomServices = {
  deleteChatRoomService,
  getAllMessagesFromChatRoomService,
};
