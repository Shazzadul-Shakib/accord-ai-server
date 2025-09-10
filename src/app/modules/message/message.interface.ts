import { Types } from 'mongoose';

export interface IMessage {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  createdAt?: Date;
}
export interface IMessageSummary {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId;
  sender: {
    _id?: Types.ObjectId;
    name: string;
  };
  text: string;
  createdAt?: Date;
}
