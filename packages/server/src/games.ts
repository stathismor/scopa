import { Server as IOServer } from 'socket.io';
import { last } from 'lodash';
import { Card, GameEvent, GameState, GameStatus } from 'shared';
import { Store } from './Store';
import { finalScore } from './scores';

export function updateGameState(io: IOServer, store: Store, roomName: string, gameState: GameState) {
  store.updateRoomState(roomName, gameState);
  io.in(roomName).emit(GameEvent.CurrentState, gameState);
  const isRoundFinshed = gameState.players.every((player) => player.hand.length === 0);

  const isMatchFinished = isRoundFinshed && gameState.deck.length === 0;

  console.log({ isRoundFinshed, isMatchFinished });
  if (isMatchFinished) {
    const { players, table, latestCaptured, ...rest } = gameState;

    players.forEach((player) => {
      if (player.username === latestCaptured) {
        player.captured.push(...table);
      }
    });

    const updatedGameState = {
      ...rest,
      latestCaptured,
      players,
      table: [],
    };
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
    console.info(GameStatus.Ended);
    io.in(roomName).emit(GameStatus.Ended, finalScore(players));
  } else {
    const { deck, players, table, latestCaptured, ...rest } = gameState;
    if (table.length === 0) {
      players.forEach((player) => {
        if (player.username === latestCaptured) {
          player.scopa.push(last(player.captured) as Card);
        }
      });
    }
    if (isRoundFinshed) {
      players.forEach((player) => {
        player.hand = deck.splice(0, 3);
      });
      const updatedGameState = {
        ...rest,
        table,
        players,
        deck,
        latestCaptured,
      };
      store.updateRoomState(roomName, updatedGameState);
      console.info(GameEvent.CurrentState, updatedGameState);
      io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
    }
  }
}
