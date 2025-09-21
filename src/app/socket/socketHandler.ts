import { Server as SocketServer } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AuthenticatedSocket } from '../interface/socket.interface';
import AppError from '../errorHandlers/appError';
import { status } from 'http-status';
import { userSockets } from '../utils/getSocketId';
import { messageService } from '../modules/message/message.service';
import {
  broadcastUserOnlineStatus,
  sendOnlineUsersToUser,
} from '../utils/socketUtils';

export const initializeSocket = (io: SocketServer) => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new AppError(status.UNAUTHORIZED, 'No token provided'));
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      socket.userId = decoded.userId;
      next();
    } catch{
    
      next(new AppError(status.UNAUTHORIZED, 'Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {

    if (socket.userId) {
      userSockets.set(socket.userId.toString(), socket.id);
      broadcastUserOnlineStatus(socket.userId.toString(), true);

      setTimeout(() => {
        if (socket.userId) {
          sendOnlineUsersToUser(socket.userId.toString());
        }
      }, 100);
    }

    const personalRoom = `user:${socket.userId}`;
    socket.join(personalRoom);

    socket.on('join_room', (roomId: string) => {
      socket.join(`room:${roomId}`);
    });

    socket.on('send_message', async ({ roomId, text, isTyping }) => {
      try {
        await messageService.sendMessageToRoomService(
          { text, isTyping },
          { roomId },
          { userId: socket.userId },
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          socket.emit('error_message', { error: err.message });
        } else {
          socket.emit('error_message', { error: 'Unknown error' });
        }
      }
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        userSockets.delete(socket.userId.toString());
        broadcastUserOnlineStatus(socket.userId.toString(), false);
      }
    });

    socket.on('user_disconnect', () => {
      if (socket.userId) {
        userSockets.delete(socket.userId.toString());
        broadcastUserOnlineStatus(socket.userId.toString(), false);
      }
      socket.disconnect(true);
    });
  });
};
