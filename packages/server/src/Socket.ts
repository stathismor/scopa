import { Server as IOServer, Socket } from 'socket.io';
import { UserEvent, RoomEvent, GameEvent, PlayerAction } from 'shared';
import { createUsername } from './users';
import { createRoom, joinRoom } from './rooms';
import { restartGameState, updateGameState } from './games';

export const registerListeners = (io: IOServer) => {
  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on(UserEvent.UsernameMissing, () => {
      createUsername(socket);
    });

    socket.on(RoomEvent.Create, async () => {
      await createRoom(io, socket);
    });

    socket.on(RoomEvent.Join, async (roomId: string, username: string) => {
      await joinRoom(io, socket, roomId, username);
    });

    socket.on(GameEvent.PlayerAction, async (roomId: string, playerAction: PlayerAction) => {
      await updateGameState(io, roomId, playerAction);
    });

    socket.on(GameEvent.NewRound, async (roomId: string) => {
      await restartGameState(io, roomId);
    });
  });
};
