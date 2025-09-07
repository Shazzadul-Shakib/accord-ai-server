import { Server as SocketServer } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AuthenticatedSocket } from '../interface/socket.interface';
import AppError from '../errorHandlers/appError';
import httpStatus from 'http-status';
import { userSockets } from '../utils/getSocketId';

export const initializeSocket = (io: SocketServer) => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication error');
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      socket.userId = decoded.userId;
      next();
    } catch {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication error');
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    // Store user socket mapping
    if (socket.userId) {
      userSockets.set(socket.userId.toString(), socket.id);
    }

    // Join user to their personal room
    const personalRoom = `user:${socket.userId}`;
    socket.join(personalRoom);

    // Handle joining topic rooms
    socket.on('join_topic', (topicId: string) => {
      socket.join(`topic:${topicId}`);
    });

    // Handle leaving topic rooms
    socket.on('leave_topic', (topicId: string) => {
      socket.leave(`topic:${topicId}`);
      console.log(`📤 User ${socket.userId} left topic ${topicId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 User ${socket.userId} disconnected`);
      if (socket.userId) {
        userSockets.delete(socket.userId.toString());
      }
    });
  });
};
