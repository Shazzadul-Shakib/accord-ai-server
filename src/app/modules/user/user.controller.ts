import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { status } from 'http-status';
import { userService } from './user.service';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await userService.registerUser(user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const userController = {
  registerUser,
};
