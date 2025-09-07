import status from 'http-status';
import AppError from '../../errorHandlers/appError';
import { IUser } from './user.interface';
import { UserModel } from './user.model';
import { createToken } from '../../utils/createToken';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

// ----- user register service ----- //
const registerUser = async (user: IUser) => {
  // check if user exist by email
  const isUserExist = await UserModel.isUserExistByEmail(user.email);
  if (isUserExist) {
    throw new AppError(
      status.BAD_REQUEST,
      'User already exist with this email!',
    );
  }

  const result = await UserModel.create(user);
  return result;
};

// ----- user login service ----- //
const loginUser = async (user: IUser) => {
  // ----- check if user exist by email ----- //
  const isUserExist = await UserModel.isUserExistByEmail(user.email);
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }
  // ----- check if password matched ----- //
  const isPasswordMatched = await UserModel.isPasswordMatched(
    user.password,
    isUserExist.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, 'Password not matched!');
  }

  // ----- create token ----- //
  const accessToken = createToken(
    {
      email: isUserExist.email,
      userId: isUserExist._id,
    },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    {
      email: isUserExist.email,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return { accessToken, refreshToken };
};

// ----- refresh token service ----- //
const refreshToken = async (refreshToken: string) => {
  // verify refresh token
  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  if (!decoded) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid refresh token!');
  }
  // check if user exist
  const isUserExist = await UserModel.isUserExistByEmail(decoded.email);
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }
  // create new access token
  const accessToken = createToken(
    {
      email: isUserExist.email,
      userId: isUserExist._id,
    },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return { accessToken };
};

export const userService = {
  registerUser,
  loginUser,
  refreshToken,
};
