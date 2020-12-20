import { Server as IOServer } from 'socket.io';

import { Store } from './Store';
import { GameEvent, GameState, GameStatus } from 'shared';

export function updateGameState(io: IOServer, store: Store, roomName: string, gameState: GameState) {
  store.updateRoomState(roomName, gameState);
  io.in(roomName).emit(GameEvent.CurrentState, gameState);
  const isRoundFinshed = gameState.players.every((player) => player.hand.length === 0);

  const isMatchFinished = isRoundFinshed && gameState.table.length === 0;

  if (isMatchFinished) {
    // TODO send the final score need to figure out who was the last player to capture cards because
    // all the final cards on the table will need to go to them
    io.in(roomName).emit(GameStatus.Ended);
  } else if (isRoundFinshed) {
    const { deck, players, ...rest } = gameState;
    const updatedPlayersHands = players.map((player) => ({
      ...player,
      hand: deck.splice(0, 3),
    }));
    const updatedGameState = {
      ...rest,
      players: updatedPlayersHands,
      deck,
    };
    store.updateRoomState(roomName, updatedGameState);
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
  }
}
