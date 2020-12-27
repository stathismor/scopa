import { createClient, ClientOpts } from 'redis';
import { Room } from './schema';
import * as util from 'util';

const client = createClient(process.env.REDIS_URL as ClientOpts);
const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);

export async function getRoom(roomName: string): Promise<Room> {
  const room = await getAsync(roomName);

  return room ? JSON.parse(room) : undefined;
}

export async function setRoom(roomName: string, room: Room) {
  await setAsync(roomName, JSON.stringify(room));
}
