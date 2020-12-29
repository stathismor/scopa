import { GameState } from 'shared';

export const ROOM_PREFIX = 'room';

export type Player = {
  name: string;
};

export type Room = {
  name: string;
  owner: string;
  players: Player[];
  states: GameState[];
};
