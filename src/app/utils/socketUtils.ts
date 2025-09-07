import { io } from '../../server';
import { MessageData } from '../interface/message.interface';
import { NotificationData } from '../interface/notification.interface';

// Send notification to specific users
export const sendNotificationToUsers = (
  userIds: string[],
  notification: NotificationData,
) => {
  userIds.forEach(userId => {
    io.to(`user:${userId}`).emit('notification', {
      id: Date.now().toString(),
      ...notification,
      recipientId: userId,
    });
  });
};

// Send notification to a topic room
export const sendNotificationToTopic = (
  topicId: string,
  notification: NotificationData,
) => {
  io.to(`topic:${topicId}`).emit('topic_notification', {
    id: Date.now().toString(),
    topicId,
    ...notification,
  });
};

// Send direct message between users
export const sendDirectMessage = (
  senderId: string,
  recipientId: string,
  message: MessageData,
) => {
  // Send to recipient
  io.to(`user:${recipientId}`).emit('direct_message', {
    ...message,
    senderId,
    recipientId,
    timestamp: new Date(),
  });

  // Send acknowledgment to sender
  io.to(`user:${senderId}`).emit('message_sent', {
    messageId: message._id,
    recipientId,
    status: 'delivered',
  });
};

// Broadcast user online status
export const broadcastUserOnlineStatus = (
  userId: string,
  isOnline: boolean,
) => {
  io.emit('user_status_changed', {
    userId,
    isOnline,
    timestamp: new Date(),
  });
};

// Send typing indicator to topic room
export const sendTypingToTopic = (
  topicId: string,
  userId: string,
  userName: string,
  isTyping: boolean,
) => {
  io.to(`topic:${topicId}`).emit('user_typing', {
    topicId,
    userId,
    userName,
    isTyping,
    timestamp: new Date(),
  });
};

// *** MISSING FUNCTION *** - Send message to topic room (group chat)
export const sendMessageToTopic = (
  topicId: string,
  senderId: string,
  message: MessageData,
) => {
  // Send message to all users in the topic room
  io.to(`topic:${topicId}`).emit('topic_message', {
    ...message,
    topicId,
    senderId,
    createdAt: new Date(),
  });

  // Send acknowledgment to sender
  io.to(`user:${senderId}`).emit('message_sent', {
    messageId: message._id,
    topicId,
    status: 'delivered',
    timestamp: new Date(),
  });
};

