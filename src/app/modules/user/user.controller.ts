import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { status } from 'http-status';
import { userService } from './user.service';
import config from '../../config';

// ----- user register controller ----- //
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

// ----- user login controller ----- //
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await userService.loginUser(user);

  // Set refresh token cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: config.node_env === 'production',
    secure: true,
  });

  // Set access token cookie
  res.cookie('accessToken', result.accessToken, {
    httpOnly: config.node_env === 'production',
    secure: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User logged in successfully',
  });
});

// ----- user refresh token controller ----- //
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const {refreshToken} = req.cookies;
  const result = await userService.refreshToken(refreshToken);

  // Set access token cookie
  res.cookie('accessToken', result.accessToken, {
    httpOnly: config.node_env === 'production',
    secure: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'New refresh token set successfully',
  });
});

export const userController = {
  registerUser, 
  loginUser,
  refreshToken,
};
