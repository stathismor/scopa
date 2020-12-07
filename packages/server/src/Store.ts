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

  getRooms() {
    return Object.keys(this.rooms).map((name) => {
      return { ...this.rooms[name] };
    });
  }

  getRoom(name: string) {
    if (name in this.rooms) {
      return this.rooms[name];
    }
    return undefined;
  }

  roomExists(name: string) {
    return name in this.rooms;
  }

  addRoom(room: Room) {
    this.rooms[room.name] = room;
  }

  getPlayers(roomName: string) {
    return this.rooms[roomName].players;
  }

  addPlayer(roomName: string, player: Player) {
    this.rooms[roomName].players.push(player);
  }
}
