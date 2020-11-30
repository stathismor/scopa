import { Server as IOServer, Socket } from 'socket.io';

const MAX_ROOM_SIZE = 2;

export class RoomManager {
  io: IOServer;
  socket: Socket;

  constructor(io: IOServer, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  async init(roomName: string) {
    // @ts-expect-error
    // TS2445: Property 'rooms' is protected and only accessible within class 'Adapter' and its subclasses.
    const room = await this.io.sockets.adapter.rooms.get(roomName);
    if (room === undefined || room.size < MAX_ROOM_SIZE) {
      await this.socket.join(roomName);

      // TODO: Use a common logging format
      console.info(`[CREATE] Client created and joined room ${roomName}`);
      this.socket.emit('join-success');
      return true;
    } else {
      console.warn(`[CREATE FAILED] Client denied join, as room ${roomName} is full`);
      this.socket.emit('join-error', 'Room is full');
      return false;
    }
  }
}
