import { Card } from './cards';

export type PlayerState = {
  username: string;
  hand: Card[];
  captured: Card[];
  scopa: Card[];
  score: Score;
};

export const GameEvent = {
  CurrentState: 'current-game-state',
  PlayerAction: 'player-action',
  Scopa: 'scopa-game-state',
  NewRound: 'new-round',
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

export type PlayerActionUndo = {
  action: typeof PlayerActionType.Undo;
  description: string;
  playerName: string;
};
export type PlayerActionPlayOnTable = {
  action: typeof PlayerActionType.PlayOnTable;
  description: string;
  playerName: string;
  card: string;
};
export type PlayerActionCaptuerd = {
  action: typeof PlayerActionType.Capture;
  description: string;
  playerName: string;
  card: string;
  tableCards: string[];
};
export type PlayerAction = PlayerActionUndo | PlayerActionPlayOnTable | PlayerActionCaptuerd;
type ScoreDetail = {
  label: string;
  value?: string | number;
  cards?: readonly Card[];
};

export type Score = {
  details: readonly ScoreDetail[];
  total: number;
  totalRound: number;
};
