import { Server as IOServer } from 'socket.io';

import { GameEvent, GameState, GameStatus } from 'shared';
import { Store } from './Store';
import { finalScore } from './scores';

export function updateGameState(io: IOServer, store: Store, roomName: string, gameState: GameState) {
  store.updateRoomState(roomName, gameState);
  io.in(roomName).emit(GameEvent.CurrentState, gameState);
  const isRoundFinshed = gameState.players.every((player) => player.hand.length === 0);

  const isMatchFinished = isRoundFinshed && gameState.deck.length === 0;

  console.log({ isRoundFinshed, isMatchFinished });

  if (isMatchFinished) {
    const { players, ...rest } = gameState;
    // TODO need to figure out who was the last player to capture cards because
    // all the final cards on the table will need to go to them https://github.com/strahius/scopa/issues/24
    const updatedPlayers = players.map((player) => ({
      ...player,
      hand: player.captured,
      captured: [],
    }));
    console.info(GameEvent.CurrentState, updatedPlayers);
    io.in(roomName).emit(GameEvent.CurrentState, {
      ...rest,
      players: updatedPlayers,
    });
    console.info(GameStatus.Ended, finalScore(players));
    io.in(roomName).emit(GameStatus.Ended, finalScore(players));
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
    console.info(GameEvent.CurrentState, updatedGameState);
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
  }
}
