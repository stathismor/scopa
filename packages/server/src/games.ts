import { Server as IOServer } from 'socket.io';
import { last, cloneDeep } from 'lodash';
import {
  Card,
  GameEvent,
  GameState,
  GameStatus,
  PlayerAction,
  cardKey,
  fromCardKey,
  PlayerActionType,
  PlayerActionPlayOnTable,
  PlayerActionCaptuerd,
  getCardName,
} from 'shared';
import { finalScore } from './scores';
import { getCurrentState, addState, getRoom } from './controllers/roomController';
import { generateGameState } from './utils';
import { Room } from './database/models';

/**
 * Calculate the immediate new game state, as a result of a player's action. This is not necessarily the final state
 * but an intermediate one to help the following calculations.
 */
function calculatePlayerAction(oldState: GameState, playerAction: PlayerActionPlayOnTable | PlayerActionCaptuerd) {
  const newState = cloneDeep(oldState);
  const newPlayerAction = cloneDeep(playerAction);
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

    newPlayerAction.description = `Player <strong>${playerAction.playerName}</strong> placed <strong>${getCardName(
      playerAction.card,
    )}</strong> on the table`;
  } else if (playerAction.action === PlayerActionType.Capture) {
    const { card, tableCards } = playerAction;
    newState.players = [
      opponent,
      {
        ...activePlayer,
        hand,
        captured: [...activePlayer.captured, fromCardKey(card), ...tableCards.map((c) => fromCardKey(c))],
      },
    ];
    newState.table = newState.table.filter((c) => !tableCards.includes(cardKey(c)));
    newState.latestCaptured = activePlayer.username;
    const cardsText = playerAction.tableCards.reduce((text, value, index, array) => {
      const separator = index === 0 ? '' : index < array.length - 1 ? ', ' : ' and ';
      return `${text}${separator}<strong>${getCardName(value)}</strong>`;
    }, '');
    newPlayerAction.description = `Player <strong>${
      playerAction.playerName
    }</strong> captured ${cardsText} with a <strong>${getCardName(playerAction.card)}</strong>`;
  }
  return [newState, newPlayerAction] as const;
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
    if (table.length > 0) {
      players.forEach((player) => {
        if (player.username === latestCaptured) {
          player.captured.push(...table);
        }
      });
      newState.table = [];
    }
    newState.status = GameStatus.Ended;
  } else {
    // If match has not finished but table is empty, this means a Scopa took place.
    if (table.length === 0) {
      players.forEach((player) => {
        if (player.username === latestCaptured) {
          const lastCard = last(player.captured) as Card;
          player.scopa.push(lastCard);
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

export async function updateGameState(io: IOServer, roomName: string, playerAction: PlayerAction) {
  // const oldState = (await getCurrentState(roomName)) as GameState;
  const room = await getRoom(roomName);

  if (!room) {
    // TODO: Handle this
    return;
  }
  const oldState = last(room.states) as GameState;

  switch (playerAction.action) {
    case PlayerActionType.Undo: {
      const states = room.states;
      states.pop();

      await Room.updateOne({ _id: room._id }, { states });

      const newState = last(room.states);

      const newPlayerAction = cloneDeep(playerAction);
      newPlayerAction.description = `Player <strong>${playerAction.playerName}</strong> reverted their last turn`;

      io.in(roomName).emit(GameEvent.CurrentState, newState, newPlayerAction);
      return;
    }
    default: {
      const [tempState, finalPlayerAction] = calculatePlayerAction(oldState, playerAction);
      const [finalState, isMatchFinished] = calculatePlayerTurn(tempState);

      if (isMatchFinished) {
        const scores = finalScore(finalState.players);
        finalState.players.forEach((player, i) => {
          player.score = scores[i];
        });
        finalState.status = GameStatus.Ended;
      }

      await addState(roomName, finalState);
      io.in(roomName).emit(GameEvent.CurrentState, finalState, finalPlayerAction);
      return;
    }
  }
}

export async function restartGameState(io: IOServer, roomName: string, isGameFinished: boolean) {
  const { players, activePlayer } = (await getCurrentState(roomName)) as GameState;
  // TODO: Later on we will need to add order of players, built into the model
  const nextPlayer = players.find((p) => p.username !== activePlayer);
  const state = generateGameState(
    players.map((p) => p.username),
    `${nextPlayer?.username}`,
    players.map((p) => (p.score.total && !isGameFinished ? p.score.total : 0)),
  );

  // FIXME: Handle round increment here
  await addState(roomName, state);
  io.in(roomName).emit(GameEvent.CurrentState, state);
}
