import { Server as IOServer, Socket } from 'socket.io';

import { Store, Room, Player } from './Store';
import { RoomEvent, GameEvent, GameState, GameStatus } from 'shared';
import { generateRoomName, generateGameState } from './utils';

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
    await doJoinRoom(io, socket, store, room);
  } else if (room.players.length >= MAX_ROOM_SIZE) {
    console.warn(`[JOIN FAILED] Room ${roomName} is full`);
    socket.emit(RoomEvent.JoinError, 'Room is full');
  } else {
    const newPlayer = new Player(username);
    store.addPlayer(roomName, newPlayer);

    await doJoinRoom(io, socket, store, room);
  }
}

async function doJoinRoom(io: IOServer, socket: Socket, store: Store, room: Room) {
  await socket.join(room.name);

  console.info(`[JOIN] Client joined room ${room.name}`);
  socket.emit(RoomEvent.JoinSuccess);

  // If room is full, emit current state
  if (room.players.length >= MAX_ROOM_SIZE) {
    let state = store.getRoomState(room.name);
    if (!state) {
      const playerNames = room.players.map((player) => player.name);
      // HACK: Temporary initial state
      state = generateGameState(playerNames);
      store.addGameState(room.name, state);
    }

    io.in(room.name).emit(GameEvent.CurrentState, state);
  }
}

export function updateGameState(io: IOServer, store: Store, roomName: string, gameState: GameState) {
  store.updateRoomState(roomName, gameState);
  io.in(roomName).emit(GameEvent.CurrentState, gameState);
  const isRoundFinshed = gameState.players.every((player) => player.hand.length === 0);

  const isMatchFinished = isRoundFinshed && gameState.table.length === 0;

  if (isMatchFinished) {
    // TODO send the final score need to figure out who was the last player to capture cards because
    // all the final cards on the table will need to go to them
    io.in(roomName).emit(GameStatus.Ended);
  } else if (isRoundFinshed) {
    const { deck, players, ...rest } = gameState;
    const updatedPlayersHands = players.map((player) => ({
      ...player,
      hand: deck.splice(0, 3),
    }));
    const updatedGameState = {
      ...rest,
      players: updatedPlayersHands,
      deck,
    };
    store.updateRoomState(roomName, updatedGameState);
    io.in(roomName).emit(GameEvent.CurrentState, updatedGameState);
  }
}
