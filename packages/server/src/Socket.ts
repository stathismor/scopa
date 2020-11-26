import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';

export const createSocket = (server: HTTPServer) => {
  const io = new IOServer(server);

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
