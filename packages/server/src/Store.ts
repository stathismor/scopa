export class Player {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
export class Room {
  name: string;
  players: Player[];

  constructor(name: string) {
    this.name = name;
    this.players = [];
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
}
