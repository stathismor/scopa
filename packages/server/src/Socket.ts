import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';

export const createSocket = (server: HTTPServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: process.env.SOCKET_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message1', (arg: string) => {
      console.log('message1 -', arg);

      socket.emit('message2', 'Hello client');
    });
  });
};
