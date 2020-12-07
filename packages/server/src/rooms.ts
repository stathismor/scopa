import { Server as IOServer, Socket } from 'socket.io';

import { Store, Room, Player } from './Store';
import { RoomEvents } from 'shared';
import { generateRoomName, generateUsername } from './utils';

const MAX_ROOM_SIZE = 2;

export async function createRoom(io: IOServer, socket: Socket, store: Store, username: string) {
  const roomName = generateRoomName();

  // @ts-expect-error
  // TS2445: Property 'rooms' is protected and only accessible within class 'Adapter' and its subclasses.
  const room = await io.sockets.adapter.rooms.get(roomName);
  if (room === undefined || room.size < MAX_ROOM_SIZE) {
    await socket.join(roomName);

    const player = new Player(username);
    const newRoom = new Room([player]);
    store.addRoom(roomName, newRoom);
    io.sockets.emit('rooms', store.getRooms());
    console.log('store.getRooms', store.getRooms())

    // TODO: Use a common logging format
    console.info(`[CREATE] Client created and joined room ${roomName}`);
    socket.emit(RoomEvents.CreateSuccess, roomName);
  } else {
    console.warn(`[CREATE FAILED] Client denied join, as room ${roomName} is full`);
    socket.emit(RoomEvents.CreateError, 'Room is full');
  }
}

export async function joinRoom(
  io: IOServer,
  socket: Socket,
  store: Store,
  roomName: string,
  username: string,
) {
  const room = store.getRoom(roomName);
  console.log('roomName', roomName)
  console.log('username', username)
  console.log('room', room)
  console.log('store.getRooms', store.getRooms())
  console.log('store.getPlayers(roomName).length', store.getPlayers(roomName).length)
  if (room === undefined) {
    if (store.roomExists(roomName)) {
      await doJoinRoom(socket, store, roomName, username);
    } else {
      console.warn(`[JOIN FAILED] Room ${roomName} does not exist`);
      socket.emit(RoomEvents.JoinError, 'Room does not exist');
    }
  } else if (store.getPlayers(roomName).length >= MAX_ROOM_SIZE) {
    console.warn(`[JOIN FAILED] Room ${roomName} is full`);
    socket.emit(RoomEvents.JoinError, 'Room is full');
  } else {
    await doJoinRoom(socket, store, roomName, username);
  }
}

async function doJoinRoom(socket: Socket, store: Store, roomName: string, username: string) {
  await socket.join(roomName);
  const newUsername = username;

  const player = new Player(newUsername);
  store.addPlayer(roomName, player);

  console.info(`[JOIN] Client joined room ${roomName}`);
  socket.emit(RoomEvents.JoinSuccess);
}
