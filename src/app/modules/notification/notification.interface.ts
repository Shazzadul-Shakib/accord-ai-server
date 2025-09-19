import { Types } from 'mongoose';

export interface ISender {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface ITopic {
  _id: Types.ObjectId;
  topic: string;
  status: string;
}

export interface INotification {
  _id: Types.ObjectId;
  recipientId: Types.ObjectId;
  senderId: ISender;
  topicId: ITopic;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
