import { GameState } from 'shared';
import mongoose from 'mongoose';
import { Room, IRoom, IPlayer } from '../database/models';

export interface IRoomExtended extends IRoom {
  players: IPlayer[];
}

export async function getRoom(_id: string): Promise<IRoomExtended | null> {
  const rooms = await Room.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(_id) },
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

export async function createRoom(name: string) {
  const room = new Room({ name });
  await room.save();
  return room;
}

export async function addState(roomId: string, state: GameState) {
  await Room.updateOne({ _id: mongoose.Types.ObjectId(roomId) }, { $push: { states: state } });
}

export async function getCurrentState(roomId: string): Promise<GameState | undefined> {
  const room = await Room.findOne({ _id: mongoose.Types.ObjectId(roomId) });

  if (!room) {
    return undefined;
  }

  return room.getCurrentState();
}

export async function deleteRoom(roomId: string, username: string) {
  const room = await Room.findOne({ _id: mongoose.Types.ObjectId(roomId) });

  if (!room) {
    throw new Error(`Room $(roomId) does not exist`);
  }

  if (room.owner !== username) {
    throw new Error('Room can only be deleted by room owner');
  }

  await Room.deleteOne({ _id: mongoose.Types.ObjectId(roomId) });
}

export async function setOwner(id: mongoose.Types.ObjectId, username: string) {
  await Room.updateOne({ _id: id }, { owner: username });
}

export async function addPlayer(_id: mongoose.Types.ObjectId, playerId: mongoose.Types.ObjectId) {
  await Room.updateOne({ _id: _id }, { $push: { playerIds: playerId } });
}
