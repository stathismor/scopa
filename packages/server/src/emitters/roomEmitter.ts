import { Server as IOServer } from 'socket.io';
import { RoomEvent, GameEvent } from 'shared';
import { getRooms } from '../controllers/roomController';

export async function emitRoomUpdate(io: IOServer) {
  const rooms = await getRooms();
  io.sockets.emit(RoomEvent.Update, rooms);
}
