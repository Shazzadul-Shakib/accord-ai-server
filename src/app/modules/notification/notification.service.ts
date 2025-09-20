import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { NotificationModel } from './notification.model';
import { getRelativeTime } from '../../utils/getFornmattedTimestamp';
import AppError from '../../errorHandlers/appError';
import status from 'http-status';

// ----- create notification service ------ //
const createNotificationService = async (payload: INotification) => {
  const result = await NotificationModel.create(payload);
  return result;
};

// ----- get user notifications service ----- //
const getUserNotificationsService = async (user: JwtPayload) => {
  const notifications = await NotificationModel.find({
    recipientId: user.userId,
  })
    .populate('senderId', 'name email _id')
    .populate('topicId', '_id topic status')
    .sort({ createdAt: -1 });

  // Transform notifications into required format
  const formattedNotifications = notifications.map(notification => {
    return {
      id: notification?._id,
      topicId: notification?.topicId?._id,
      title: `New Notification from ${notification?.senderId?.name}`,
      hasResponse:notification.hasResponse,
      description: `" ${notification?.senderId?.name}" has invited you to a topic room for discussing about " ${notification?.topicId?.topic}"`,
      time: getRelativeTime(notification.createdAt),
    };
  });

  return formattedNotifications;
};

// ----- delete notification service ----- //
const deleteNotificationService = async (
  user: JwtPayload,
  notificationId: string,
) => {
  const { userId } = user;

  //----- find user is the recipient of the notification ----- //
  const isUserRecipient = await NotificationModel.findOne({
    recipientId: userId,
  });
  if (!isUserRecipient) {
    throw new AppError(
      status.BAD_REQUEST,
      'You can not delete this notification',
    );
  }

  const result = await NotificationModel.findByIdAndDelete(notificationId);

  return result;
};

export const notificationServices = {
  createNotificationService,
  getUserNotificationsService,
  deleteNotificationService,
};
