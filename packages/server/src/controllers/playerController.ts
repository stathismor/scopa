import { Player, IPlayer } from '../database/models';

export async function getPlayer(name: string): Promise<IPlayer | null> {
  return Player.findOne({ name });
}

export async function createPlayer(name: string): Promise<IPlayer> {
  const player = new Player({ name });
  return player.save();
}
