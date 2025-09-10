import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { chatRoomServices } from './room.service';
import { Types } from 'mongoose';

// ----- delete chatroom controller ----- //
const deleteChatRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  await chatRoomServices.deleteChatRoomService(roomId as string, userId as Types.ObjectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat room deleted successfully',
  });
});

// ----- get all messages from chatroom controller ----- //
const getAllMessagesFromChatRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  const result = await chatRoomServices.getAllMessagesFromChatRoomService(roomId as string, userId as Types.ObjectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat messages retrieved successfully',
    data:result
  });
});

// ----- summarize all messages from chatroom controller ----- //
const summarizeAllMessagesFromChatRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  const result = await chatRoomServices.generateChatSummaryService(roomId as string, userId as Types.ObjectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat summary generated successfully',
    data:result
  });
});

export const roomController = {
  deleteChatRoom,
  getAllMessagesFromChatRoom,
  summarizeAllMessagesFromChatRoom,
};
