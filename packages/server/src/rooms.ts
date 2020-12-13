import { Server as IOServer, Socket } from 'socket.io';

import { Store, Room, Player } from './Store';
import { RoomEvent } from 'shared';
import { generateRoomName } from './utils';

const MAX_ROOM_SIZE = 2;

export function createRoom(io: IOServer, socket: Socket, store: Store, username: string) {
  const roomName = generateRoomName();

  const room = store.getRoom(roomName);
  if (room !== undefined) {
    console.warn(`[CREATE FAILED] Room ${roomName} already exists`);
    socket.emit(RoomEvent.CreateError, 'Room already exists');
    return;
  }

  const newRoom = new Room(roomName);
  store.addRoom(newRoom);
  console.info(`[CREATE] Created room ${roomName}`);
  socket.emit(RoomEvent.CreateSuccess, roomName);
}

export async function joinRoom(io: IOServer, socket: Socket, store: Store, roomName: string, username: string) {
  const room = store.getRoom(roomName);

  if (room === undefined) {
    console.warn(`[JOIN FAILED] Room ${roomName} does not exist`);
    socket.emit(RoomEvent.JoinError, 'Room does not exist');
    return;
  }

  const player = room.players.find((player) => player.name === username);
  if (player) {
    await doJoinRoom(socket, store, roomName, player);
  } else if (room.players.length >= MAX_ROOM_SIZE) {
    console.warn(`[JOIN FAILED] Room ${roomName} is full`);
    socket.emit(RoomEvent.JoinError, 'Room is full');
  } else {
    const newPlayer = new Player(username);
    store.addPlayer(roomName, newPlayer);

    await doJoinRoom(socket, store, roomName, newPlayer);
  }
}

async function doJoinRoom(socket: Socket, store: Store, roomName: string, player: Player) {
  await socket.join(roomName);

  console.info(`[JOIN] Client joined room ${roomName}`);
  socket.emit(RoomEvent.JoinSuccess);
}
