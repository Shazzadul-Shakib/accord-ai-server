import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { messageService } from './message.service';
import { JwtPayload } from 'jsonwebtoken';

const sendMessageToRoom = catchAsync(async (req: Request, res: Response) => {
  
  const result = await messageService.sendMessageToRoomService(
    req.body,
    { roomId: req.params.roomId as string },
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message sent successfully to the room',
    data: result,
  });
});

export const messageController = {
  sendMessageToRoom,
};
