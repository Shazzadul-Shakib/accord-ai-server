import status from 'http-status';
import AppError from '../../errorHandlers/appError';
import { IUser } from './user.interface';
import { UserModel } from './user.model';

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

export const userService = {
  registerUser,
};
