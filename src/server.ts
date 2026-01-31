import mongoose from 'mongoose';
import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import config from './app/config';
import { initializeSocket } from './app/socket/socketHandler';
import app from './app';

let server: HTTPServer;
let io: SocketServer;

async function main() {
  try {
    // MongoDB connection with timeout and pooling for production
    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10, // Maximum connection pool size
      minPoolSize: 2, // Minimum connection pool size
      maxIdleTimeMS: 10000, // Close connections after 10s idle
      retryWrites: true,
      retryReads: true,
    });

    console.log('✅ MongoDB connected successfully');

    server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
    // Initialize Socket.IO
    io = new SocketServer(server, {
      cors: {
        origin: (origin, callback) => {
          const allowedOrigins = [
            'http://localhost:3000',
            'https://accord-ai-client.vercel.app',
          ];
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      },
    });

    // Initialize socket handlers
    initializeSocket(io);

    // Make io accessible globally
    app.set('io', io);
  } catch (error) {
    console.log(error);
  }
}

main();

//  ----- handle unhandledRejections & uncaughtExceptions ----- //
process.on('unhandledRejection', (reason, promise) => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

export { io };
