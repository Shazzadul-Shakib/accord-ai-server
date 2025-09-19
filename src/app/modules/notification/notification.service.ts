import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { NotificationModel } from './notification.model';

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
      id: notification._id,
      title: `New Notification from ${notification?.senderId?.name}`,
      description: `" ${notification?.senderId?.name}" has invited you to a topic room for discussing about " ${notification?.topicId?.topic}"`,
      time: getRelativeTime(notification.createdAt),
    };
  });

  return formattedNotifications;
};

// Helper function to convert timestamp to relative time
const getRelativeTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} hours ago`;
  } else {
    return `${Math.floor(minutes / 1440)} days ago`;
  }
};

export const notificationServices = {
  createNotificationService,
  getUserNotificationsService,
};
