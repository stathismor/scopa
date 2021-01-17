import { isEmpty, last } from 'lodash';
import { GameState, Room as RoomShared } from 'shared';
import * as redisClient from '../database/redisClient';
import { Room, Player, ROOM_PREFIX } from '../database/schema';
import { Room as RoomMDB, IRoom, IPlayer } from '../database/models';

const ROOM_MATCH_PREFIX = `${ROOM_PREFIX}-*`;

export interface IRoomExtended extends IRoom {
  players: IPlayer[];
}

export async function getRoom(roomName: string): Promise<Room> {
  const room = await redisClient.getRoom(roomName);
  return room;
}

export async function getRooms(prefix: string = ROOM_MATCH_PREFIX) {
  const rooms = await redisClient.getRooms(prefix);
  return rooms;
}

export async function getRoomMDB(roomName: string): Promise<IRoomExtended | null> {
  const rooms = await RoomMDB.aggregate([
    {
      $match: { name: roomName },
    },
    {
      $lookup: {
        from: 'players',
        localField: 'playerIds',
        foreignField: '_id',
        as: 'players',
      },
    },
  ]);

  if (!rooms) {
    return null;
  }

  return rooms[0];
}

export async function getRoomsMDB() {
  const rooms = await RoomMDB.aggregate([
    {
      $lookup: {
        from: 'players',
        localField: 'playerIds',
        foreignField: '_id',
        as: 'players',
      },
    },
  ]);

  return rooms;
}

export async function addRoom(room: Room) {
  await redisClient.setRoom(room.name, room);
}

export async function setOwner(roomName: string, owner: string) {
  const room = await getRoom(roomName);

  room.owner = owner;

  await redisClient.setRoom(roomName, room);
}

export async function deleteRoom(roomName: string, username: string) {
  const room = await getRoom(roomName);
  if (room.owner !== username) {
    // TODO: Raise/emit something here the client can get
    throw new Error('Room can only be deleted by room owner');
  }
  redisClient.delAsync(roomName);
}

export async function addPlayer(roomName: string, player: Player) {
  const room = await getRoom(roomName);

  room.players.push(player);

  await redisClient.setRoom(roomName, room);
}

export async function addRound(roomName: string) {
  const room = await getRoom(roomName);

  room.states.push([]);

  await redisClient.setRoom(roomName, room);
}

export async function addGameState(roomName: string, state: GameState) {
  const room = await getRoom(roomName);

  room.states[room.states.length - 1].push(state);

  await redisClient.setRoom(roomName, room);
}

export async function removeGameState(roomName: string) {
  const room = await getRoom(roomName);
  if (room.states[room.states.length - 1].length > 1) {
    room.states[room.states.length - 1].pop();
  }
  await redisClient.setRoom(roomName, room);
}

export async function getRoomState(roomName: string): Promise<GameState | undefined> {
  const room = await redisClient.getRoom(roomName);

  if (isEmpty(room.states[room.states.length - 1])) {
    return undefined;
  }

  return last(room.states[room.states.length - 1]);
}
