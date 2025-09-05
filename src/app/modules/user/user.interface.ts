import { Model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}
export interface IUserModel extends Model<IUser> {
  isUserExistByEmail(email: string): Promise<IUser>;
  isPasswordMatched(
    textPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
