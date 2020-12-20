import { GameState } from 'shared';
import { isEmpty, last } from 'lodash';
export class Player {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
export class Room {
  name: string;
  players: Player[];
  states: GameState[];

  constructor(name: string) {
    this.name = name;
    this.players = [];
    this.states = [];
  }
}

export class Store {
  rooms: { [key: string]: Room };

  constructor() {
    this.rooms = {};
  }

  getRoom(roomName: string) {
    return this.rooms[roomName];
  }

  addRoom(room: Room) {
    this.rooms[room.name] = room;
  }

  addPlayer(roomName: string, player: Player) {
    this.rooms[roomName].players.push(player);
  }

  getRoomState(roomName: string): GameState | undefined {
    const room = this.getRoom(roomName);

    if (isEmpty(room.states)) {
      return undefined;
    }

    return last(room.states);
  }

  updateRoomState(roomName: string, gameState: GameState) {
    const room = this.getRoom(roomName);
    room.states.push(gameState);
  }

  addGameState(roomName: string, state: GameState) {
    const room = this.getRoom(roomName);
    room.states.push(state);
  }
}
