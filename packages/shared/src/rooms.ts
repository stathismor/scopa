import { Player } from './users';

export type Room = {
  name: string;
  players: Player[];
};

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
  Update: 'room-update',
} as const;
export type RoomEvent = typeof RoomEvent[keyof typeof RoomEvent];
