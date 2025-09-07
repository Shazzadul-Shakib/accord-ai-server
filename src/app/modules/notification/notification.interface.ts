import { Types } from 'mongoose';
import { NotificationData } from '../../interface/notification.interface';

export interface INotification {
  _id?: Types.ObjectId;
  recipientId: Types.ObjectId;
  senderId?: Types.ObjectId;
  data?: NotificationData;
  topicId: Types.ObjectId;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
