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
    httpOnly: true,
    sameSite: 'lax',
  });

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
  });
  
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Logged in successfully',
  });
});

// ----- get all users controller ----- //
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await userService.getAllUsers(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All users retrived successfully',
    data: result,
  });
});

// ----- user refresh token controller ----- //
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
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

// ----- update user profile controller ----- //
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateProfileService(req.body, req.user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Updated Profile successfully',
    data: result,
  });
});

// ----- logout user controller ----- //
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear access and refresh token cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Logged out successfully',
  });
});

// ----- user refresh token controller ----- //
const getLoggedUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await userService.getLoggedUser(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrived successfully',
    data: result,
  });
});

export const userController = {
  registerUser,
  loginUser,
  getAllUsers,
  refreshToken,
  updateProfile,
  logoutUser,
  getLoggedUser,
};
