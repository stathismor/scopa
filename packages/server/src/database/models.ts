import mongoose from 'mongoose';
import { last } from 'lodash';
import { GameState } from 'shared';

export interface IPlayer extends mongoose.Document {
  name: string;
}
const PlayerSchema = new mongoose.Schema({
  name: String,
});

export interface IRoom extends mongoose.Document {
  name: string;
  owner: string;
  createdAt: string;
  playerIds: mongoose.Schema.Types.ObjectId[];
  states: GameState[];

  getCurrentState(): GameState;
}
const RoomSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  owner: String,
  createdAt: String,
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
});
RoomSchema.methods.getCurrentState = function (self: any) {
  return last(self.states);
};

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
export const Room = mongoose.model<IRoom>('Room', RoomSchema);
