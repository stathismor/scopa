import { Server as IOServer } from 'socket.io';
import { RoomEvent } from 'shared';
import { getRooms } from '../controllers/roomControllerMDB';

export async function emitRoomUpdate(io: IOServer) {
  const rooms = await getRooms();
  io.sockets.emit(RoomEvent.Update, rooms);
}
