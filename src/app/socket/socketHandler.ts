import { Server as SocketServer } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AuthenticatedSocket } from '../interface/socket.interface';
import AppError from '../errorHandlers/appError';
import httpStatus from 'http-status';
import { userSockets } from '../utils/getSocketId';
import { messageService } from '../modules/message/message.service';

export const initializeSocket = (io: SocketServer) => {
  // ----- Authentication middleware ----- //
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
    // ----- Store user socket mapping ----- //
    if (socket.userId) {
      userSockets.set(socket.userId.toString(), socket.id);
    }

    // ----- Join user to their personal room ----- //
    const personalRoom = `user:${socket.userId}`;
    socket.join(personalRoom);

    // ----- Handle joining topic rooms ----- //
    socket.on('join_room', (roomId: string) => {
      socket.join(`room:${roomId}`);
      console.log(`📥 User ${socket.userId} joined room ${roomId}`);
    });

    // ----- Handle sending messages ----- //
    socket.on('send_message', async ({ roomId, text, isTyping }) => {
      try {
        await messageService.sendMessageToRoomService(
          { text, isTyping },
          { roomId },
          { userId: socket.userId }, // user
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          socket.emit('error_message', { error: err.message });
        } else {
          socket.emit('error_message', { error: 'Unknown error' });
        }
      }
    });

    // ----- Handle leaving topic rooms ----- //
    socket.on('leave_room', (roomId: string) => {
      socket.leave(`room:${roomId}`);
      console.log(`📤 User ${socket.userId} left room ${roomId}`);
    });

    // ----- Handle disconnect ----- //
    socket.on('disconnect', () => {
      console.log(`🔴 User ${socket.userId} disconnected`);
      if (socket.userId) {
        userSockets.delete(socket.userId.toString());
      }
    });
  });
};
