import { io } from '../../server';
import { NotificationData } from '../interface/notification.interface';
import { getOnlineUsers, getUserSocketId, onlineUsers } from './getSocketId';

// ----- Send notification to specific users ----- //
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

// ----- Broadcast user online status ----- //
export const broadcastUserOnlineStatus = (
  userId: string,
  isOnline: boolean,
) => {
  console.log(
    `📡 Broadcasting status: User ${userId} is ${isOnline ? 'online' : 'offline'}`,
  );

  if (isOnline) {
    onlineUsers.add(userId);
  } else {
    onlineUsers.delete(userId);
  }

  // Broadcast to all connected clients
  io.emit('user_status_changed', {
    userId,
    isOnline,
    timestamp: new Date(),
  });

  // Also send updated online users list
  io.emit('online_users_updated', {
    onlineUsers: getOnlineUsers(),
    timestamp: new Date(),
  });
};

// ----- Send initial online users list to a specific user ----- //
export const sendOnlineUsersToUser = (userId: string) => {
  const socketId = getUserSocketId(userId);
  if (socketId) {
    io.to(socketId).emit('online_users_list', {
      onlineUsers: getOnlineUsers(),
      timestamp: new Date(),
    });
  }
};

// ----- Send typing indicator to topic room ----- //
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

// ----- Send message to topic room (group chat) ----- //
export const sendMessageToRoom = (
  roomId: string,
  senderId: string,
  text: string,
  isTyping: boolean = false,
) => {
  // Handle typing indicator
  if (text === '' && typeof isTyping === 'boolean') {
    // This is a typing indicator event
    io.to(`topic:${roomId}`).emit('user_typing', {
      roomId,
      senderId,
      isTyping,
    });

    io.to(`room:${roomId}`).emit('user_typing', {
      roomId,
      senderId,
      isTyping,
    });
    return;
  }

  // Handle actual message sending
  if (text && text.trim() !== '') {
    const messageData = {
      text,
      roomId,
      senderId,
      createdAt: new Date(),
      _id: new Date().getTime().toString(),
    };

    // ----- Send message to all users in the topic room ----- //
    io.to(`topic:${roomId}`).emit('send_message', messageData);

    // ----- Broadcast to everyone in the room ----- //
    io.to(`room:${roomId}`).emit('room_message', messageData);

    // ----- Send acknowledgment to sender ----- //
    io.to(`user:${senderId}`).emit('message_sent', {
      text,
      roomId,
      senderId,
      status: 'delivered',
      timestamp: new Date(),
      _id: messageData._id,
    });

    // Stop typing indicator for this user after sending message
    io.to(`topic:${roomId}`).emit('user_typing', {
      roomId,
      senderId,
      isTyping: false,
    });

    io.to(`room:${roomId}`).emit('user_typing', {
      roomId,
      senderId,
      isTyping: false,
    });
  }
};