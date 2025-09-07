import { INotification } from "./notification.interface";
import { NotificationModel } from "./notification.model";

// ----- create notification service ------ //
const createNotificationService = async (payload: INotification) => {
  const result = await NotificationModel.create(payload);
  return result;
};

export const notificationServices = {
  createNotificationService,
};