import { Player, IPlayer } from '../database/models';

export async function getPlayer(name: string): Promise<IPlayer | null> {
  const player = await Player.findOne({ name });
  return player;
}

export async function createPlayer(name: string): Promise<IPlayer> {
  const player = new Player({ name });
  await player.save();
  return player;
}
