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
import { getRoomState, addGameState, removeGameState } from './controllers/roomController';

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

    newPlayerAction.description = `Player ${playerAction.playerName} placed ${getCardName(
      playerAction.card,
    )} on the table`;
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
    const cardsText = playerAction.tableCards.reduce(
      (text, value, i, array) => `${text}${i < array.length - 1 ? ', ' : ' and '}${getCardName(value)}`,
    );
    newPlayerAction.description = `Player ${playerAction.playerName} captured ${cardsText} with a ${getCardName(
      playerAction.card,
    )}`;
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
  const oldState = (await getRoomState(roomName)) as GameState;
  switch (playerAction.action) {
    case PlayerActionType.Undo: {
      await removeGameState(roomName);
      const prevState = await getRoomState(roomName);

      const newPlayerAction = cloneDeep(playerAction);
      newPlayerAction.description = `Player ${playerAction.playerName} reverted their last turn`;

      io.in(roomName).emit(GameEvent.CurrentState, prevState, newPlayerAction);
      return;
    }
    case PlayerActionType.SelectFromHand: {
      const newPlayerAction = cloneDeep(playerAction);
      const newState = cloneDeep(oldState);
      if (newState.activePlayerCard === playerAction.card) {
        newState.activePlayerCard = null;
        newPlayerAction.description = `Player ${playerAction.playerName} deselected`;
      } else {
        newState.activePlayerCard = playerAction.card;
        newPlayerAction.description = `Player ${playerAction.playerName} selected a card`;
      }
      addGameState(roomName, newState);
      io.in(roomName).emit(GameEvent.CurrentState, newState, newPlayerAction);
      return;
    }
    case PlayerActionType.SelectFromTable: {
      const newPlayerAction = cloneDeep(playerAction);
      const newState = cloneDeep(oldState);
      if (newState.activeCardsOnTable?.includes(playerAction.card)) {
        newState.activeCardsOnTable = newState.activeCardsOnTable.filter((c) => c !== playerAction.card);
        newPlayerAction.description = `Player ${playerAction.playerName} deselected`;
      } else if (playerAction.card === null) {
        newState.activeCardsOnTable = [];
        newPlayerAction.description = `Player ${playerAction.playerName} Cleaned up`;
      } else {
        newState.activeCardsOnTable.push(playerAction.card);
        newPlayerAction.description = `Player ${playerAction.playerName} selected a card`;
      }
      addGameState(roomName, newState);
      io.in(roomName).emit(GameEvent.CurrentState, newState, newPlayerAction);
      return;
    }
    default: {
      const [tempState, finalPlayerAction] = calculatePlayerAction(oldState, playerAction);
      const [finalState, isMatchFinished] = calculatePlayerTurn(tempState);

      addGameState(roomName, finalState);
      io.in(roomName).emit(GameEvent.CurrentState, finalState, finalPlayerAction);
      if (isMatchFinished) {
        io.in(roomName).emit(GameStatus.Ended, finalScore(finalState.players));
      }
      return;
    }
  }
}
