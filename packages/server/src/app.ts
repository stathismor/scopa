import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from './Server';
import { registerListeners } from './Socket';

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string, { useNewUrlParser: true, useUnifiedTopology: true });

const server: HTTPServer = createServer();

// TODO: Come up with a better way to expose io
export const io = new IOServer(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

registerListeners(io);
