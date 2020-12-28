import { Server as IOServer } from 'socket.io';
import { last, cloneDeep } from 'lodash';
import { Card, GameEvent, GameState, GameStatus, PlayerAction, cardKey, fromCardKey, PlayerActionType } from 'shared';
import { finalScore } from './scores';
import { getRoomState, addGameState, removeGameState } from './controllers/roomController';

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

/**
 * Calculate the immediate new game state, as a result of a player's action. This is not necessarily the final state
 * but an intermediate one to help the following calculations.
 */
function calculatePlayerAction(oldState: GameState, playerAction: PlayerAction) {
  const newState = cloneDeep(oldState);

  // TODO: Later on we will need to add order of players, built into the model
  const { activePlayer, opponent } = Object.fromEntries(
    oldState?.players?.map((player) => [
      player.username === oldState?.activePlayer ? 'activePlayer' : 'opponent',
      player,
    ]),
  );

  const hand = activePlayer.hand.filter((c) => cardKey(c) !== playerAction.card);

  newState.activePlayer = opponent.username;
  if (playerAction.action === PlayerActionType.PlayOnTable) {
    newState.players = [
      opponent,
      {
        ...activePlayer,
        hand,
      },
    ];
    newState.table.push(fromCardKey(playerAction.card));
  } else if (playerAction.action === PlayerActionType.Capture) {
    newState.players = [
      opponent,
      {
        ...activePlayer,
        hand,
        captured: [
          ...activePlayer.captured,
          fromCardKey(playerAction.card),
          ...(playerAction?.tableCards?.map((c) => fromCardKey(c)) ?? []),
        ],
      },
    ];
    newState.table = newState.table.filter((c) => !playerAction?.tableCards?.includes(cardKey(c)));
    newState.latestCaptured = activePlayer.username;
  }
  return newState;
}

/**
 * Calculate the new game state, as it should be at the end of a player's turn.
 */
function calculatePlayerTurn(oldState: GameState) {
  const newState = cloneDeep(oldState);

  const { players, deck, table, latestCaptured } = newState;

  const isRoundFinshed = oldState.players.every((player) => player.hand.length === 0);
  const isMatchFinished = isRoundFinshed && oldState.deck.length === 0;
  // If match is finished (players and deck have no cards left), we add the remaining table
  // cards to the player captured last and change the status to Ended.
  if (isMatchFinished) {
    players.forEach((player) => {
      if (player.username === latestCaptured) {
        player.captured.push(...table);
      }
    });
    newState.table = [];
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
  }
  newState.players = players;
  newState.deck = deck;

  return [newState, isMatchFinished] as const;
}

export async function updateGameStateNew(io: IOServer, roomName: string, playerAction: PlayerAction) {
  const oldState = await getRoomState(roomName);

  if (!oldState) {
    // TODO: Need to think about this, this should not be possible I think,
    // just put it here for now cause TS complains
    return;
  }

  if (playerAction.action === PlayerActionType.Undo) {
    await removeGameState(roomName);
    const prevState = await getRoomState(roomName);
    io.in(roomName).emit(GameEvent.CurrentState, prevState);
    return;
  }

  const tempState = calculatePlayerAction(oldState, playerAction);
  const [finalState, isMatchFinished] = calculatePlayerTurn(tempState);

  addGameState(roomName, finalState);
  io.in(roomName).emit(GameEvent.CurrentState, finalState);
  if (isMatchFinished) {
    io.in(roomName).emit(GameStatus.Ended, finalScore(finalState.players));
  }
}
