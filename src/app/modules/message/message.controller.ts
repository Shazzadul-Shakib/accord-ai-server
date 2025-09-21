import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { status } from 'http-status';
import { messageService } from './message.service';
import { JwtPayload } from 'jsonwebtoken';

// ----- send message to the room controller ----- //
const sendMessageToRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await messageService.sendMessageToRoomService(
    req.body,
    { roomId: req.params.roomId as string },
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Message sent successfully to the room',
    data: result,
  });
});

// ----- delete message from the room controller ----- //
const deleteMessageFromRoom = catchAsync(
  async (req: Request, res: Response) => {
    await messageService.deleteMessageFromRoomService(
      {
        roomId: req.params.roomId as string,
        messageId: req.params.messageId as string,
      },
      req.user as JwtPayload,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Message deleted successfully from the room',
    });
  },
);

// ----- update message from the room controller ----- //
const updateMessageFromRoom = catchAsync(
  async (req: Request, res: Response) => {
    const result = await messageService.updateMessageFromRoomService(
      { text: req.body.text as string },
      {
        roomId: req.params.roomId as string,
        messageId: req.params.messageId as string,
      },
      req.user as JwtPayload,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Message updated successfully from the room',
      data: result,
    });
  },
);

export const messageController = {
  sendMessageToRoom,
  deleteMessageFromRoom,
  updateMessageFromRoom,
};
