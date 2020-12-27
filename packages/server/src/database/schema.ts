export type Player = {
  name: string;
};

export type Room = {
  name: string;
  players: Player[];
  states: GameState[];
};
