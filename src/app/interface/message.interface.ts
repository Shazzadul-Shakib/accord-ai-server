import { Types } from 'mongoose';

export interface MessageData {
  _id?: Types.ObjectId;
  text: string;
}
