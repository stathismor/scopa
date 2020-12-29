import { Server as IOServer, Socket } from 'socket.io';
import { UserEvent, RoomEvent, GameEvent, GameState, PlayerAction } from 'shared';
import { createUsername } from './users';
import { createRoom, joinRoom } from './rooms';
import { updateGameState, updateGameStateNew } from './games';

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

    socket.on(RoomEvent.Join, async (roomName: string, username: string) => {
      await joinRoom(io, socket, roomName, username);
    });

    socket.on(GameEvent.UpdateState, async (roomName: string, gameState: GameState) => {
      await updateGameState(io, roomName, gameState);
    });

    socket.on(GameEvent.PlayerAction, async (roomName: string, playerAction: PlayerAction) => {
      await updateGameStateNew(io, roomName, playerAction);
    });
  });
};
