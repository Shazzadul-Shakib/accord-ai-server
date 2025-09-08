import { Types } from 'mongoose';

export interface IMessage {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  createdAt?: Date;
}
