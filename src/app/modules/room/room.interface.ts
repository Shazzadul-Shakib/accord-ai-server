import { Types } from 'mongoose';

export interface IChatRoom {
  topic: Types.ObjectId;
  members: Types.ObjectId[];
}
