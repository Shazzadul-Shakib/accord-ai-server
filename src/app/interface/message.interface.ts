import { Types } from 'mongoose';

export interface MessageData {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  topicId: Types.ObjectId;
}
