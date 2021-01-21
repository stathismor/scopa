import { Server as IOServer, Socket } from 'socket.io';
import { sample, last } from 'lodash';
import { RoomEvent, GameEvent } from 'shared';
import { getRoom, addRoom, setOwner, getCurrentState, addState, IRoomExtended } from './controllers/roomControllerMDB';
import { Player } from './database/schema';
import { getPlayer, addPlayer } from './controllers/playerController';
import { generateRoomName, generateGameState } from './utils';
import { emitRoomUpdate } from './emitters/roomEmitter';

const MAX_PLAYERS = 2;

export async function createRoom(io: IOServer, socket: Socket) {
  const name = generateRoomName();

  const room = await getRoom(name);

  if (room) {
    console.warn(`[CREATE FAILED] Room ${name} already exists`);
    socket.emit(RoomEvent.CreateError, 'Room already exists');
    return;
  }

  await addRoom(name);

  console.info(`[CREATE] Created room ${name}`);
  socket.emit(RoomEvent.CreateSuccess, name);

  await emitRoomUpdate(io);
}

export async function joinRoom(io: IOServer, socket: Socket, roomName: string, username: string) {
  const room = await getRoom(roomName);

  if (!room) {
    console.warn(`[JOIN FAILED] Room ${roomName} does not exist`);
    socket.emit(RoomEvent.JoinError, 'Room does not exist');
    return;
  }

  const player = room.players.find((player: Player) => player.name === username);
  if (player) {
    await doJoinRoom(io, socket, roomName, username);
  } else if (room.players.length < MAX_PLAYERS) {
    let newPlayer = await getPlayer(username);

    if (!newPlayer) {
      newPlayer = await addPlayer(username);
    }

    await doJoinRoom(io, socket, roomName, username);
  } else {
    // Spectator
    await joinSocketRoom(socket, roomName);
    const state = await getCurrentState(roomName);

    socket.emit(GameEvent.CurrentState, state);
  }
}

async function doJoinRoom(io: IOServer, socket: Socket, roomName: string, username: string) {
  await joinSocketRoom(socket, roomName);

  const room = (await getRoom(roomName)) as IRoomExtended;

  if (room.players.length === 1 && !room.owner) {
    await setOwner(room.id, username);
  }

  // If room is full, emit current state
  if (room.players.length === MAX_PLAYERS) {
    let state = last(room.states);

    if (!state) {
      const playerNames = room.players.map((player: Player) => player.name);
      const activePlayer = sample(playerNames);

      // HACK: Temporary initial state
      state = generateGameState(playerNames, activePlayer!);

      await addState(room.id, state);
    }

    io.in(roomName).emit(GameEvent.CurrentState, state);
  }
  await emitRoomUpdate(io);
}

async function joinSocketRoom(socket: Socket, roomName: string) {
  await socket.join(roomName);

  console.info(`[JOIN] Client joined room ${roomName}`);
  socket.emit(RoomEvent.JoinSuccess);
}
