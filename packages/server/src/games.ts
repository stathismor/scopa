import { Server as IOServer } from 'socket.io';
import { last } from 'lodash';
import { Card, GameEvent, GameState, GameStatus } from 'shared';
import { finalScore } from './scores';
import { addGameState } from './controllers/roomController';

export async function updateGameState(io: IOServer, roomName: string, gameState: GameState) {
  const isRoundFinshed = gameState.players.every((player) => player.hand.length === 0);

  const isMatchFinished = isRoundFinshed && gameState.deck.length === 0;

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

    await addGameState(roomName, updatedGameState);
    console.info(GameEvent.CurrentState, updatedGameState);
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
    console.info(GameStatus.Ended);
    io.in(roomName).emit(GameStatus.Ended, finalScore(players));
  } else {
    const { players, deck, table, latestCaptured, ...rest } = gameState;
    if (table.length === 0) {
      players.forEach((player) => {
        if (player.username === latestCaptured) {
          player.scopa.push(last(player.captured) as Card);
          // TODO notify users that a scopa happened
          console.info(GameEvent.Scopa, player.username, player.scopa);
          io.in(roomName).emit(GameEvent.Scopa, player.username);
        }
      });
    }
    if (isRoundFinshed) {
      players.forEach((player) => {
        player.hand = deck.splice(0, 3);
      });
    }
    const updatedGameState = {
      ...rest,
      table,
      players,
      deck,
      latestCaptured,
    };
    await addGameState(roomName, updatedGameState);
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
  }
}
