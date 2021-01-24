import { GameState } from 'shared';
import mongoose from 'mongoose';
import { Room, IRoom, IPlayer } from '../database/models';

export interface IRoomExtended extends IRoom {
  players: IPlayer[];
}

export async function getRoom(name: string): Promise<IRoomExtended | null> {
  const rooms = await Room.aggregate([
    {
      $match: { name },
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

export async function getRooms() {
  return Room.aggregate([
    {
      $lookup: {
        from: 'players',
        localField: 'playerIds',
        foreignField: '_id',
        as: 'players',
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);
}

export async function createRoom(name: string) {
  const room = new Room({ name });
  return room.save();
}

export async function addState(roomName: string, state: GameState) {
  await Room.updateOne({ name: roomName }, { $push: { states: state } });
}

export async function getCurrentState(roomName: string): Promise<GameState | undefined> {
  const room = await Room.findOne({ name: roomName });

  if (!room) {
    return undefined;
  }

  return room.getCurrentState();
}

export async function deleteRoom(roomName: string, username: string) {
  const room = await Room.findOne({ name: roomName });

  if (!room) {
    throw new Error(`Room $(roomName) does not exist`);
  }

  if (room.owner !== username) {
    throw new Error('Room can only be deleted by room owner');
  }

  await Room.deleteOne({ name: roomName });
}

export async function setOwner(id: mongoose.Types.ObjectId, username: string) {
  await Room.updateOne({ _id: id }, { owner: username });
}

export async function addPlayer(roomId: mongoose.Types.ObjectId, playerId: mongoose.Types.ObjectId) {
  await Room.updateOne({ _id: roomId }, { $push: { playerIds: playerId } });
}
