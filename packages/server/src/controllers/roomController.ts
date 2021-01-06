import { isEmpty, last } from 'lodash';
import { GameState } from 'shared';
import * as redisClient from '../database/redisClient';
import { Room, Player, ROOM_PREFIX } from '../database/schema';

const ROOM_MATCH_PREFIX = `${ROOM_PREFIX}-*`;

export async function getRoom(roomName: string): Promise<Room> {
  const room = await redisClient.getRoom(roomName);
  return room;
}

export async function getRooms(prefix: string = ROOM_MATCH_PREFIX) {
  const rooms = await redisClient.getRooms(prefix);
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
    throw new Error('Room can be deleted only from room owner')
  }
  redisClient.delAsync(roomName);
}

export async function addPlayer(roomName: string, player: Player) {
  const room = await getRoom(roomName);

  room.players.push(player);

  await redisClient.setRoom(roomName, room);
}

export async function addGameState(roomName: string, state: GameState) {
  const room = await getRoom(roomName);

  room.states.push(state);

  await redisClient.setRoom(roomName, room);
}

export async function removeGameState(roomName: string) {
  const room = await getRoom(roomName);
  if (room.states.length > 1) {
    room.states.pop();
  }
  await redisClient.setRoom(roomName, room);
}

export async function getRoomState(roomName: string): Promise<GameState | undefined> {
  const room = await redisClient.getRoom(roomName);

  if (isEmpty(room.states)) {
    return undefined;
  }

  return last(room.states);
}
