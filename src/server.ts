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
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {});
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
