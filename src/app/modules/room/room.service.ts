import { Types } from 'mongoose';
import AppError from '../../errorHandlers/appError';
import { ChatRoomModel } from './room.model';
import { status } from 'http-status';
import { TopicRequestModel } from '../topic/topic.model';
import { MessageModel } from '../message/message.model';
import { IMessageSummary } from '../message/message.interface';
import { generateChatSummary } from '../../gemini/gemini.config';

// ----- delete chatroom service ----- //
const deleteChatRoomService = async (
  roomId: string,
  userId: Types.ObjectId,
) => {
  // ----- check if the user is a member of the chat room ----- //
  const chatRoom = await ChatRoomModel.findById(roomId);
  if (!chatRoom) {
    throw new AppError(status.NOT_FOUND, 'Chat room not found');
  }
  if (
    !chatRoom.members.some(member => member.toString() === userId.toString())
  ) {
    throw new AppError(
      status.FORBIDDEN,
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
  roomId: Types.ObjectId,
  userId: Types.ObjectId,
  cursor?: string,
  limit: number = 20,
) => {
  // ----- check if room exists ----- //
  const chatRoom = await ChatRoomModel.findById(roomId);
  if (!chatRoom) {
    throw new AppError(status.NOT_FOUND, 'Chat room not found');
  }

  // ----- check if user is a member ----- //
  if (!chatRoom.members.some(m => m.toString() === userId.toString())) {
    throw new AppError(
      status.FORBIDDEN,
      'User is not a member of the chat room',
    );
  }

  // ----- Build query ----- //
  const query: { roomId: Types.ObjectId; createdAt?: { $lt: Date } } = {
    roomId,
  };

  if (cursor && !isNaN(Date.parse(cursor))) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  // ----- Fetch messages in ascending order ----- //
  const messages = await MessageModel.find(query)
    .sort({ createdAt: -1 }) // oldest → newest
    .limit(limit)
    .populate({
      path: 'sender',
      model: 'User',
      select: '_id name',
    })
    .lean();

  return messages;
};

// ----- generate chat summary service ----- //
const generateChatSummaryService = async (
  roomId: string,
  userId: Types.ObjectId,
) => {
  // ----- check if room exists ----- //
  const chatRoom = await ChatRoomModel.findById(roomId).populate({
    path: 'topic',
    select: 'topic',
  });
  if (!chatRoom) {
    throw new AppError(status.NOT_FOUND, 'Chat room not found');
  }

  const roomTopic = (chatRoom?.topic as { topic: string })?.topic || '';

  // ----- check if the user is a member of the chat room ----- //
  if (
    !chatRoom.members.some(member => member.toString() === userId.toString())
  ) {
    throw new AppError(
      status.FORBIDDEN,
      'User is not a member of the chat room',
    );
  }
  const allMessages = await MessageModel.find({ roomId })
    .populate({
      path: 'sender',
      select: 'name',
    })
    .lean<IMessageSummary[]>();

  // ----- format chat messages for summarization ----- //
  const formattedChat = allMessages
    .map(msg => `${msg.sender.name}: ${msg.text}`)
    .join('\n');
  const chatSummary = await generateChatSummary(formattedChat, roomTopic);

  // ----- update chat room summary ----- //
  const result = await ChatRoomModel.findByIdAndUpdate(
    roomId,
    {
      summary: chatSummary.summary,
    },
    {
      new: true,
    },
  );

  return result;
};

export const chatRoomServices = {
  deleteChatRoomService,
  getAllMessagesFromChatRoomService,
  generateChatSummaryService,
};
