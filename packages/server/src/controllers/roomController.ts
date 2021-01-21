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
  const rooms = await Room.aggregate([
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

export async function addRoom(name: string) {
  const room = new Room({ name });
  await room.save();
  return room;
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

  await Room.deleteOne({ size: 'large' });
}

export async function setOwner(id: mongoose.Types.ObjectId, username: string) {
  await Room.updateOne({ _id: id }, { owner: username });
}
