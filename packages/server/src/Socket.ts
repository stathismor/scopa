import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { RoomManager } from './RoomManager';

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

    socket.on('join', async (roomName: string) => {
      const roomManager = new RoomManager(io, socket);
      await roomManager.init(roomName);
    });

    socket.on('message1', (arg: string) => {
      console.log('message1 -', arg);

      socket.emit('message2', 'Hello client');
    });
  });
};
