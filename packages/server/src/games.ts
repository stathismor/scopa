import { Server as IOServer } from 'socket.io';
import { last } from 'lodash';
import { Card, GameEvent, GameState, GameStatus, cardKey, fromCardKey, TurnUpdates } from 'shared';
import { Store } from './Store';
import { finalScore } from './scores';

export function handCaptured(io: IOServer, store: Store, roomName: string, turnUpdates: TurnUpdates) {
  const prevGameState = store.getRoomState(roomName);

  if (!prevGameState) {
    return;
  }
  const { activePlayer, opponent } = Object.fromEntries(
    prevGameState?.players?.map((player) => [
      player.username !== prevGameState?.activePlayer ? 'activePlayer' : 'opponent',
      player,
    ]),
  );
  const gameState = {
    ...prevGameState,
    activePlayer: opponent.username,
    players: [
      opponent,
      {
        ...activePlayer,
        hand: activePlayer.hand.filter((c) => cardKey(c) !== turnUpdates.activePlayerCard),
        captured: [
          ...activePlayer.captured,
          fromCardKey(turnUpdates.activePlayerCard),
          ...turnUpdates.activeCardsOnTable.map((c) => fromCardKey(c)),
        ],
      },
    ],
    table: prevGameState?.table.filter((c) => !turnUpdates.activeCardsOnTable.includes(cardKey(c))),
    latestCaptured: activePlayer.username,
  };
  return updateGameState(io, store, roomName, gameState);
}

export function updateGameState(io: IOServer, store: Store, roomName: string, gameState: GameState) {
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

    store.updateRoomState(roomName, updatedGameState);
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
    store.updateRoomState(roomName, updatedGameState);
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
  }
}
