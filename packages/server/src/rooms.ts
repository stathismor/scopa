import { Server as IOServer, Socket } from 'socket.io';
import { generateRoomName } from './utils';

const MAX_ROOM_SIZE = 2;

export async function createRoom(io: IOServer, socket: Socket) {
  const roomName = generateRoomName();

  // @ts-expect-error
  // TS2445: Property 'rooms' is protected and only accessible within class 'Adapter' and its subclasses.
  const room = await io.sockets.adapter.rooms.get(roomName);
  if (room === undefined || room.size < MAX_ROOM_SIZE) {
    await socket.join(roomName);

    // TODO: Use a common logging format
    console.info(`[CREATE] Client created and joined room ${roomName}`);
    socket.emit('create-room-success', roomName);
  } else {
    console.warn(`[CREATE FAILED] Client denied join, as room ${roomName} is full`);
    socket.emit('create-room-error', 'Room is full');
  }
}

export async function joinRoom(io: IOServer, socket: Socket, roomName: string) {
  // @ts-expect-error
  // TS2445: Property 'rooms' is protected and only accessible within class 'Adapter' and its subclasses.
  const room = await io.sockets.adapter.rooms.get(roomName);
  if (room === undefined) {
    console.warn(`[JOIN FAILED] Room ${roomName} does not exist`);
    socket.emit('join-room-error', 'Room does not exist');
  } else if (room.size >= MAX_ROOM_SIZE) {
    console.warn(`[JOIN FAILED] Room ${roomName} is full`);
    socket.emit('join-room-error', 'Room is full');
  } else {
    await socket.join(roomName);
    console.info(`[JOIN] Client joined room ${roomName}`);
    socket.emit('join-room-success');
  }
}
