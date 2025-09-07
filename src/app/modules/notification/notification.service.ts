import { JwtPayload } from "jsonwebtoken";
import { INotification } from "./notification.interface";
import { NotificationModel } from "./notification.model";

// ----- create notification service ------ //
const createNotificationService = async (payload: INotification) => {
  const result = await NotificationModel.create(payload);
  return result;
};

// ----- get user notifications service ----- //
const getUserNotificationsService = async (user: JwtPayload) => {
  const result = await NotificationModel.find({
    recipientId: user.userId,
  });
  
  return result;
};

export const notificationServices = {
  createNotificationService,
  getUserNotificationsService,
};