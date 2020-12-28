import { Server as IOServer, Socket } from 'socket.io';
import { RoomEvent, GameEvent } from 'shared';
import { getRoom, addRoom, getRoomState, addPlayer, addGameState } from './controllers/roomController';
import { Room, Player } from './database/schema';
import { generateRoomName, generateGameState } from './utils';
import { emitRoomUpdate } from './emitters/roomEmitter';

const MAX_ROOM_SIZE = 2;

export async function createRoom(io: IOServer, socket: Socket) {
  const roomName = generateRoomName();

  const room = await getRoom(roomName);
  if (room !== undefined) {
    console.warn(`[CREATE FAILED] Room ${roomName} already exists`);
    socket.emit(RoomEvent.CreateError, 'Room already exists');
    return;
  }

  const newRoom = { name: roomName, players: [], states: [] };
  await addRoom(newRoom);
  console.info(`[CREATE] Created room ${roomName}`);
  socket.emit(RoomEvent.CreateSuccess, roomName);

  await emitRoomUpdate(io);
}

export async function joinRoom(io: IOServer, socket: Socket, roomName: string, username: string) {
  const room = await getRoom(roomName);

  if (room === undefined) {
    console.warn(`[JOIN FAILED] Room ${roomName} does not exist`);
    socket.emit(RoomEvent.JoinError, 'Room does not exist');
    return;
  }

  const player = room.players.find((player: Player) => player.name === username);
  if (player) {
    await doJoinRoom(io, socket, roomName);
  } else if (room.players.length >= MAX_ROOM_SIZE) {
    console.warn(`[JOIN FAILED] Room ${roomName} is full`);
    socket.emit(RoomEvent.JoinError, 'Room is full');
  } else {
    const newPlayer = { name: username };
    await addPlayer(roomName, newPlayer);

    await doJoinRoom(io, socket, roomName);
  }
}

async function doJoinRoom(io: IOServer, socket: Socket, roomName: string) {
  await socket.join(roomName);

  console.info(`[JOIN] Client joined room ${roomName}`);
  socket.emit(RoomEvent.JoinSuccess);

  const room = await getRoom(roomName);

  // If room is full, emit current state
  if (room.players.length >= MAX_ROOM_SIZE) {
    let state = await getRoomState(room.name);
    if (!state) {
      const playerNames = room.players.map((player: Player) => player.name);
      // HACK: Temporary initial state
      state = generateGameState(playerNames);
      await addGameState(room.name, state);
    }

    io.in(room.name).emit(GameEvent.CurrentState, state);
  }
  await emitRoomUpdate(io);
}
