import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { createServer } from './Server';
import { registerListeners } from './Socket';
import * as dotenv from 'dotenv';

dotenv.config();

const server: HTTPServer = createServer();

// TODO: Come up with a better way to expose io
export const io = new IOServer(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

registerListeners(io);
