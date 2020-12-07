export const UserEvents = {
  UsernameCreated: 'username-created',
  UsernameMissing: 'username-missing',
} as const;
export type UserEvents = typeof UserEvents[keyof typeof UserEvents];

export const GameState = {
  Joined: 'joined',
  Failed: 'failed',
  Pending: 'pending',
} as const;
export type GameState = typeof GameState[keyof typeof GameState];

export const RoomEvents = {
  Create: 'create-room',
  CreateSuccess: 'create-room-success',
  CreateError: 'create-room-error',
  Join: 'join-room',
  JoinSuccess: 'join-room-success',
  JoinError: 'join-room-error',
} as const;
export type RoomEvents = typeof RoomEvents[keyof typeof RoomEvents];

export const Suit = {
  Golds: 'Golds',
  Cups: 'Cups',
  Clubs: 'Clubs',
  Swords: 'Swords',
} as const;

export type Suit = typeof Suit[keyof typeof Suit];
