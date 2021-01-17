import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from './Server';
import { registerListeners } from './Socket';

const url = 'mongodb://localhost:27017/scopa';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

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
