import { Server as IOServer } from 'socket.io';
import { last, cloneDeep } from 'lodash';
import { Card, GameEvent, GameState, GameStatus, PlayerAction, cardKey, fromCardKey, PlayerActionType } from 'shared';
import { Store } from './Store';
import { finalScore } from './scores';

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

/**
 * Calculate the immediate new game state, as a result of a player's action. This is not necessarily the final state
 * but an intermediate one to help the following calculations.
 */
function calculatePlayerAction(oldState: GameState, playerAction: PlayerAction) {
  const newState = cloneDeep(oldState);

  const [activePlayer] = oldState.players.filter((playerState) => playerState.username === playerAction.playerName);
  // TODO: Later on we will need to add order of players, built into the model
  const [opponent] = oldState.players.filter((playerState) => playerState.username !== playerAction.playerName);
  const hand = activePlayer.hand.filter((c) => cardKey(c) !== playerAction.card);

  newState.activePlayer = opponent.username;
  newState.players = [
    opponent,
    {
      ...activePlayer,
      hand,
    },
  ];
  newState.table.push(fromCardKey(playerAction.card));

  return newState;
}

/**
 * Calculate the new game state, as it should be at the end of a player's turn.
 */
function calculatePlayerTurn(oldState: GameState) {
  const { players, deck, table, latestCaptured, ...rest } = oldState;

  const isRoundFinshed = oldState.players.every((player) => player.hand.length === 0);
  const isMatchFinished = isRoundFinshed && oldState.deck.length === 0;
  let newState = cloneDeep(oldState);

  // If match is finished (players and deck have no cards left), we add the remaining table
  // cards to the player captured last and change the status to Ended.
  if (isMatchFinished) {
    players.forEach((player) => {
      if (player.username === latestCaptured) {
        player.captured.push(...table);
      }
    });

    newState.status = GameStatus.Ended;
  } else {
    // If match has not finished but table is empty, this means a Scopa took place.
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
    }
    newState.players = players;
    newState.deck = deck;
  }

  return newState;
}

export function updateGameStateNew(io: IOServer, store: Store, roomName: string, playerAction: PlayerAction) {
  const oldState = store.getRoomState(roomName);

  if (!oldState) {
    // TODO: Need to think about this, this should not be possible I think,
    // just put it here for now cause TS complains
    return;
  }

  const tempState = calculatePlayerAction(oldState, playerAction);
  const finalState = calculatePlayerTurn(tempState);

  store.updateRoomState(roomName, finalState);
  io.in(roomName).emit(GameEvent.CurrentState, finalState);
}
