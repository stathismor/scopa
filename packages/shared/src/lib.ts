export const UserEvent = {
  UsernameCreated: 'username-created',
  UsernameMissing: 'username-missing',
} as const;
export type UserEvent = typeof UserEvent[keyof typeof UserEvent];

export const RoomState = {
  Joined: 'joined',
  Failed: 'failed',
  Pending: 'pending',
} as const;
export type RoomState = typeof RoomState[keyof typeof RoomState];

export const RoomEvent = {
  Create: 'create-room',
  CreateSuccess: 'create-room-success',
  CreateError: 'create-room-error',
  Join: 'join-room',
  JoinSuccess: 'join-room-success',
  JoinError: 'join-room-error',
} as const;
export type RoomEvent = typeof RoomEvent[keyof typeof RoomEvent];

export const GameEvent = {
  CurrentState: 'current-game-state',
  UpdateState: 'update-game-state',
} as const;
export type GameEvent = typeof GameEvent[keyof typeof GameEvent];

export const Suit = {
  Golds: 'Golds',
  Cups: 'Cups',
  Clubs: 'Clubs',
  Swords: 'Swords',
} as const;

export type Suit = typeof Suit[keyof typeof Suit];

export type Card = { value: number; suit: Suit };

export type Deck = readonly Card[];

export type PlayerState = {
  username: string;
  hand: Deck;
  captured: Deck;
  scopa: Deck;
};

export type GameState = {
  status: string | undefined;
  activePlayer: string | undefined;
  deck: Deck;
  table: Deck;
  players: PlayerState[];
};
