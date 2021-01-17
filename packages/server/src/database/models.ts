import mongoose from 'mongoose';
import { last } from 'lodash';

export interface IPlayer extends mongoose.Document {
  name: string;
}
const PlayerSchema = new mongoose.Schema({
  name: String,
});

interface State {
  status: string;
  currentPlayer: string;
  lastCaptured: string;
  turn: number;
  round: number;
  players: [
    {
      _id: string;
      hand: string[];
      captured: string[];
      scopa: string[];
    },
  ];
}
export interface IRoom extends mongoose.Document {
  name: string;
  owner: string;
  craeteAt: string;
  playerIds: mongoose.Schema.Types.ObjectId[];
  states: [State];

  getCurrentState(): State;
}
const RoomSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  owner: String,
  craeteAt: String,
  playerIds: [mongoose.Schema.Types.ObjectId],
  states: [
    {
      status: String,
      currentPlayer: String,
      lastCaptured: String,
      turn: Number,
      round: Number,
      players: [
        {
          _id: String,
          hand: [String],
          captured: [String],
          scopa: [String],
        },
      ],
    },
  ],
});
RoomSchema.methods.getCurrentState = function (this: any) {
  return last(this.states[this.states.length - 1]);
};

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
export const Room = mongoose.model<IRoom>('Room', RoomSchema);
