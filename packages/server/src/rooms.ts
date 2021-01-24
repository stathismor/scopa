import { Server as IOServer, Socket } from 'socket.io';
import { sample, last } from 'lodash';
import { RoomEvent, GameEvent } from 'shared';
import {
  getRoom,
  createRoom as createDbRoom,
  addPlayer,
  setOwner,
  getCurrentState,
  addState,
  IRoomExtended,
} from './controllers/roomController';
import { Player } from './database/schema';
import { getPlayer, createPlayer } from './controllers/playerController';
import { generateUniqueName, generateGameState } from './utils';
import { emitRoomUpdate } from './emitters/roomEmitter';

const MAX_PLAYERS = 2;

export async function createRoom(io: IOServer, socket: Socket) {
  const name = generateUniqueName();
  const room = await createDbRoom(name);

  console.info(`[CREATE] Created room ${room.id}`);
  socket.emit(RoomEvent.CreateSuccess, room.id);

  await emitRoomUpdate(io);
}

export async function joinRoom(io: IOServer, socket: Socket, roomId: string, username: string) {
  const room = await getRoom(roomId);

  if (!room) {
    console.warn(`[JOIN FAILED] Room with id ${roomId} does not exist`);
    socket.emit(RoomEvent.JoinError, 'Room does not exist');
    return;
  }

  const player = room.players.find((player: Player) => player.name === username);
  if (player) {
    await doJoinRoom(io, socket, roomId, username);
  } else if (room.players.length < MAX_PLAYERS) {
    let newPlayer = await getPlayer(username);

    if (!newPlayer) {
      newPlayer = await createPlayer(username);
    }
    await addPlayer(room._id, newPlayer._id);

    await doJoinRoom(io, socket, roomId, username);
  } else {
    // Spectator
    await joinSocketRoom(socket, roomId);
    const state = await getCurrentState(roomId);

    socket.emit(GameEvent.CurrentState, state);
  }
}

async function doJoinRoom(io: IOServer, socket: Socket, roomId: string, username: string) {
  await joinSocketRoom(socket, roomId);

  const room = (await getRoom(roomId)) as IRoomExtended;

  if (room.players.length === 1 && !room.owner) {
    await setOwner(room._id, username);
  }

  // If room is full, emit current state
  if (room.players.length === MAX_PLAYERS) {
    let state = last(room.states);

    if (!state) {
      const playerNames = room.players.map((player: Player) => player.name);
      const activePlayer = sample(playerNames);

      // HACK: Temporary initial state
      state = generateGameState(playerNames, activePlayer!);

      await addState(room._id, state);
    }

    io.in(roomId).emit(GameEvent.CurrentState, state);
  }
  await emitRoomUpdate(io);
}

async function joinSocketRoom(socket: Socket, roomId: string) {
  await socket.join(roomId);

  console.info(`[JOIN] Client joined room ${roomId}`);
  socket.emit(RoomEvent.JoinSuccess);
}
