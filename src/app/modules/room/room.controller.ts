import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { status } from 'http-status';
import { chatRoomServices } from './room.service';
import { Types } from 'mongoose';

// ----- delete chatroom controller ----- //
const deleteChatRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  await chatRoomServices.deleteChatRoomService(
    roomId as string,
    userId as Types.ObjectId,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Chat room deleted successfully',
  });
});

// ----- get all chatroom for user controller ----- //
const getAllUserChatRoom = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { cursor, limit } = req.query;

    const result = await chatRoomServices.getAllUserChatRoomService(
      userId as Types.ObjectId,
      cursor as string | undefined,
      limit ? Number(limit) : 20,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Chatroom retrieved successfully',
      data: result,
    });
  },
);

// ----- get all messages from chatroom controller ----- //
const getAllMessagesFromChatRoom = catchAsync(
  async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { userId } = req.user;
    const { cursor, limit } = req.query;
    const result = await chatRoomServices.getAllMessagesFromChatRoomService(
      new Types.ObjectId(roomId),
      userId as Types.ObjectId,
      cursor as string | undefined,
      limit ? Number(limit) : 20,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Chat messages retrieved successfully',
      data: result,
    });
  },
);

// ----- summarize all messages from chatroom controller ----- //
const summarizeAllMessagesFromChatRoom = catchAsync(
  async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { userId } = req.user;
    const result = await chatRoomServices.generateChatSummaryService(
      roomId as string,
      userId as Types.ObjectId,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Chat summary generated successfully',
      data: result,
    });
  },
);

export const roomController = {
  deleteChatRoom,
  getAllMessagesFromChatRoom,
  summarizeAllMessagesFromChatRoom,
  getAllUserChatRoom,
};
