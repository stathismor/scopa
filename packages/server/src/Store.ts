export class Player {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
export class Room {
  players: Player[];

  constructor(players: Player[]) {
    this.players = players;
  }
}

export class Store {
  rooms: { [key: string]: Room };

  constructor() {
    this.rooms = {};
  }

  getRooms() {
    return Object.keys(this.rooms).map((name) => {
      return { name, ...this.rooms[name] };
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

  addRoom(name: string, room: Room) {
    this.rooms[name] = room;
  }

  getPlayers(roomName: string) {
    return this.rooms[roomName].players;
  }

  addPlayer(roomName: string, player: Player) {
    this.rooms[roomName].players.push(player);
  }
}
