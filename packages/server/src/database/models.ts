import mongoose from 'mongoose';
import { last } from 'lodash';
import { GameState } from 'shared';

export interface IPlayer extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
const PlayerSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  },
);

export interface IRoom extends mongoose.Document {
  name: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  playerIds: mongoose.Schema.Types.ObjectId[];
  states: GameState[];

  getCurrentState(): GameState;
}
const RoomSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: String,
    owner: String,
    playerIds: [mongoose.Schema.Types.ObjectId],
    states: [
      {
        status: String,
        activePlayer: String,
        latestCaptured: String,
        turn: Number,
        round: Number,
        deck: [{ type: Object }],
        table: [{ type: Object }],
        players: [{ type: Object }],
      },
    ],
  },
  {
    timestamps: true,
  },
);
RoomSchema.methods.getCurrentState = function (self: any) {
  return last(self.states);
};

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
export const Room = mongoose.model<IRoom>('Room', RoomSchema);
