import { io } from '../../server';
import { NotificationData } from '../interface/notification.interface';

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
  io.emit('user_status_changed', {
    userId,
    isOnline,
    timestamp: new Date(),
  });
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
// export const sendMessageToRoom = (
//   roomId: string,
//   senderId: string,
//   text: string,
//   isTyping: boolean,
// ) => {
//   // ----- Send message to all users in the topic room ----- //
//   io.to(`topic:${roomId}`).emit('send_message', {
//     text,
//     roomId,
//     senderId,
//     createdAt: new Date(),
//   });

//   // ----- Send acknowledgment to sender ----- //
//   io.to(`user:${senderId}`).emit('message_sent', {
//     text,
//     roomId,
//     status: 'delivered',
//     timestamp: new Date(),
//   });

//   // broadcast to everyone in the room
//   io.to(`room:${roomId}`).emit('room_message', {
//     text,
//     roomId,
//     senderId,
//     createdAt: new Date(),
//   });

//   io.to(`topic:${roomId}`).emit('user_typing', {
//     roomId,
//     senderId,
//     isTyping,
//   });
// };
//
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
      _id: new Date().getTime().toString(), // or use proper ObjectId if using MongoDB
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
