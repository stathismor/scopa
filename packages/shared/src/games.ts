import { Card } from './cards';

export type PlayerState = {
  username: string;
  hand: Card[];
  captured: Card[];
  scopa: Card[];
};

export const GameEvent = {
  CurrentState: 'current-game-state',
  UpdateState: 'update-game-state',
} as const;
export type GameEvent = typeof GameEvent[keyof typeof GameEvent];

export const GameStatus = {
  Waiting: 'waiting',
  Started: 'started',
  Playing: 'playing',
  Ended: 'ended',
} as const;
export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

type GameStateStatus =
  | {
      status: typeof GameStatus.Started | typeof GameStatus.Playing;
      activePlayer: string;
    }
  | {
      status: typeof GameStatus.Waiting | typeof GameStatus.Ended;
      activePlayer: null;
    };

export type GameState = GameStateStatus & {
  deck: Card[];
  table: Card[];
  players: PlayerState[];
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
