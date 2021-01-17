import { Server as IOServer, Socket } from 'socket.io';
import { sample, last } from 'lodash';
import { RoomEvent, GameEvent } from 'shared';
import {
  getRoom,
  addRoom,
  setOwner,
  getRoomState,
  addPlayer,
  addGameState,
  addRound,
  getRoomMDB,
  IRoomExtended,
} from './controllers/roomController';
import { Player } from './database/schema';
import { generateRoomName, generateGameState } from './utils';
import { emitRoomUpdate } from './emitters/roomEmitter';
import { Player as PlayerMDB, Room as RoomMDB } from './database/models';
import mongoose from 'mongoose';

const MAX_PLAYERS = 2;

export async function createRoom(io: IOServer, socket: Socket) {
  const name = generateRoomName();

  // const room = await getRoom(name);
  const roomMDB = await RoomMDB.findOne({ name });

  if (roomMDB) {
    console.warn(`[CREATE FAILED] Room ${name} already exists`);
    socket.emit(RoomEvent.CreateError, 'Room already exists');
    return;
  }

  // const newRoom = { name: roomName, owner: '', players: [], states: [] };
  // await addRoom(newRoom);

  const newRoomMDB = new RoomMDB({ name });
  await newRoomMDB.save();

  console.info(`[CREATE] Created room ${name}`);
  socket.emit(RoomEvent.CreateSuccess, name);

  await emitRoomUpdate(io);
}

export async function joinRoom(io: IOServer, socket: Socket, roomName: string, username: string) {
  // const room = await getRoom(roomName);
  const room = await getRoomMDB(roomName);

  if (!room) {
    console.warn(`[JOIN FAILED] Room ${roomName} does not exist`);
    socket.emit(RoomEvent.JoinError, 'Room does not exist');
    return;
  }

  const player = room.players.find((player: Player) => player.name === username);
  if (player) {
    await doJoinRoom(io, socket, room, username);
  } else if (room.players.length < MAX_PLAYERS) {
    // TODO: Check why this can return null according to TS
    // const newPlayerMDB = await PlayerMDB.findOneAndUpdate({ name: username }, new PlayerMDB({ name: username }), {upsert: true})
    let newPlayerMDB = await PlayerMDB.findOne({ name: username });
    if (!newPlayerMDB) {
      newPlayerMDB = new PlayerMDB({ name: username });
      newPlayerMDB.save();
    }

    // const newPlayer = { name: username };
    // await addPlayer(roomName, newPlayer);

    await RoomMDB.updateOne(
      { _id: room._id },
      { playerIds: [...room.playerIds, mongoose.Types.ObjectId(newPlayerMDB.id)] },
    );

    await doJoinRoom(io, socket, room, username);
  } else {
    // Spectator
    await joinSocketRoom(socket, roomName);
    const state = await getRoomState(roomName);

    if (room) {
      const stateMDB = room.states[room.states.length - 1];
    }

    socket.emit(GameEvent.CurrentState, state);
  }
}

async function doJoinRoom(io: IOServer, socket: Socket, room: IRoomExtended, username: string) {
  await joinSocketRoom(socket, room.name);

  if (room.players.length === 1 && !room.owner) {
    await RoomMDB.updateOne({ _id: room._id }, { owner: username });
  }
  console.log('room2', room);

  // If room is full, emit current state
  if (room.players.length === MAX_PLAYERS) {
    let state = room.getCurrentState();

    if (!state) {
      const playerNames = room.players.map((player: Player) => player.name);
      const activePlayer = sample(playerNames);

      // HACK: Temporary initial state
      state = generateGameState(playerNames, activePlayer!);
      await RoomMDB.updateOne({ _id: room._id }, { states: [...room.states, state] });
    }

    console.log('CURRENT STATE');
    io.in(room.name).emit(GameEvent.CurrentState, state);
  }
  await emitRoomUpdate(io);
}

async function joinSocketRoom(socket: Socket, roomName: string) {
  await socket.join(roomName);

  console.info(`[JOIN] Client joined room ${roomName}`);
  socket.emit(RoomEvent.JoinSuccess);
}
