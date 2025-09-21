import mongoose from 'mongoose';
import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import config from './app/config';
import { app } from './app';
import { initializeSocket } from './app/socket/socketHandler';

let server: HTTPServer;
let io: SocketServer;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
    });
    // Initialize Socket.IO
    io = new SocketServer(server, {
      cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
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
