import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { createRoom, joinRoom } from './rooms';

export const createSocket = (server: HTTPServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: process.env.SOCKET_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('create-room', async () => {
      await createRoom(io, socket);
    });

    socket.on('join-room', async (roomName) => {
      await joinRoom(io, socket, roomName);
    });
  });
};
