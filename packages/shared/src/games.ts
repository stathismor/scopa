import { Card } from './cards';

export type PlayerState = {
  username: string;
  hand: Card[];
  captured: Card[];
  scopa: Card[];
};

export type TurnUpdates = {
  activePlayerCard: string;
  activeCardsOnTable: string[];
};

export const GameEvent = {
  CurrentState: 'current-game-state',
  UpdateState: 'update-game-state',
  HandCaptured: 'hand-captured-game-state',
  Scopa: 'scopa-game-state',
} as const;
export type GameEvent = typeof GameEvent[keyof typeof GameEvent];

export const GameTurnEvent = {
  SelectPlayerCard: 'select-player-card',
  SelectTableCards: 'select-table-cards',
  AnimateCards: 'animate-cards',
  SelectedPlayerCard: 'selected-player-card',
  SelectedTableCards: 'selected-table-cards',
  AnimatedCards: 'animated-cards',
} as const;
export type GameTurnEvent = typeof GameTurnEvent[keyof typeof GameTurnEvent];

export const GameStatus = {
  Waiting: 'waiting',
  Started: 'started',
  Playing: 'playing',
  Ended: 'ended',
} as const;
export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

export type GameState = {
  status: GameStatus;
  activePlayer: string | null;
  deck: Card[];
  table: Card[];
  players: PlayerState[];
  latestCaptured: string;
};

type ScoreDetail = {
  label: string;
  value?: string | number;
  cards?: readonly Card[];
};

export type Score = {
  details: readonly ScoreDetail[];
  total: number;
};
