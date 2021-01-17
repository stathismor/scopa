import { Server as IOServer } from 'socket.io';
import { RoomEvent, GameEvent } from 'shared';
import { getRoomsMDB } from '../controllers/roomController';
import { Room } from '../database/models';

export async function emitRoomUpdate(io: IOServer) {
  // const rooms = await getRooms();
  const rooms = await getRoomsMDB();
  io.sockets.emit(RoomEvent.Update, rooms);
}
