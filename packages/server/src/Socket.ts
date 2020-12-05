import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { UserEvents, RoomEvents } from 'shared';
import { createUsername } from './users';
import { createRoom, joinRoom } from './rooms';
import { Store } from './Store';

export const createSocket = (server: HTTPServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: process.env.SOCKET_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  const store = new Store();

  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on(UserEvents.UsernameMissing, () => {
      createUsername(socket, store);
    });

    socket.on('create-room', async () => {
      await createRoom(io, socket, store);
    });

    socket.on(RoomEvents.Joining, async (roomName) => {
      await joinRoom(io, socket, store, roomName);
    });
  });
};
