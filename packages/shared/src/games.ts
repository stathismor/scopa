import { Card } from './cards';

export type PlayerState = {
  username: string;
  hand: Card[];
  captured: Card[];
  scopa: Card[];
};

export const GameEvent = {
  CurrentState: 'current-game-state',
  PlayerAction: 'player-action',
  Scopa: 'scopa-game-state',
} as const;
export type GameEvent = typeof GameEvent[keyof typeof GameEvent];

export const PlayerActionType = {
  PlayOnTable: 'play-on-table',
  Capture: 'capture',
  Undo: 'undo',
} as const;
export type PlayerActionType = typeof PlayerActionType[keyof typeof PlayerActionType];

export const GameStatus = {
  Waiting: 'waiting',
  Started: 'started',
  Playing: 'playing',
  Ended: 'ended',
} as const;
export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

export type GameState = {
  status: GameStatus;
  activePlayer: string;
  deck: Card[];
  table: Card[];
  players: PlayerState[];
  latestCaptured: string;
};

export type PlayerAction = {
  action: PlayerActionType;
  playerName: string;
  card: string;
  tableCards?: string[];
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

export const GameAnimationType = {
  PlayCard: 'card-on-table',
  DealCards: 'dealing-cards',
  CaptureCards: 'captured-cards',
  FlipCards: 'flip-cards',
};
export type GameAnimationType = typeof GameAnimationType[keyof typeof GameAnimationType];

export type GameAnimation = {
  kind: GameAnimationType;
  cards: string[];
};
