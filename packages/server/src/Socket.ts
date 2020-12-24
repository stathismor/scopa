import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { UserEvent, RoomEvent, GameEvent, GameState, GameTurnEvent } from 'shared';
import { createUsername } from './users';
import { createRoom, joinRoom } from './rooms';
import { updateGameState } from './games';
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

    socket.on(UserEvent.UsernameMissing, () => {
      createUsername(socket, store);
    });

    socket.on(RoomEvent.Create, async (username: string) => {
      createRoom(io, socket, store, username);
    });

    socket.on(RoomEvent.Join, async (roomName: string, username: string) => {
      await joinRoom(io, socket, store, roomName, username);
    });

    socket.on(GameEvent.UpdateState, (roomName: string, gameState: GameState) => {
      updateGameState(io, store, roomName, gameState);
    });

    socket.on(GameTurnEvent.SelectPlayerCard, (roomName: string, activePlayerCardKey: string | null) => {
      io.in(roomName).emit(GameTurnEvent.SelectedPlayerCard, activePlayerCardKey);
    });
    socket.on(GameTurnEvent.SelectTableCards, (roomName: string, activeCardKeysOnTable: string[]) => {
      io.in(roomName).emit(GameTurnEvent.SelectedTableCards, activeCardKeysOnTable);
    });
    socket.on(GameTurnEvent.AnimateCards, (roomName: string, animatedCardKeys: string[]) => {
      io.in(roomName).emit(GameTurnEvent.AnimatedCards, animatedCardKeys);
    });
  });
};
