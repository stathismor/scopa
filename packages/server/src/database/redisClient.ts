import { createClient, ClientOpts } from 'redis';
import { Room } from './schema';
import * as util from 'util';

const client = createClient(process.env.REDIS_URL as ClientOpts);
const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);
const mgetAsync: (args: string[]) => Promise<string[]> = util.promisify(client.mget).bind(client);
const scanAsync: (cursor: string, ...args: string[]) => Promise<[string, string[]]> = util
  .promisify(client.scan)
  .bind(client);
const scanAll = async (pattern: string) => {
  const found: string[] = [];
  let cursor = '0';

  do {
    const reply = await scanAsync(cursor, 'MATCH', pattern);

    cursor = reply[0];
    found.push(...reply[1]);
  } while (cursor !== '0');

  return found;
};

export async function getRoom(roomName: string): Promise<Room> {
  const room = await getAsync(roomName);

  return room ? JSON.parse(room) : undefined;
}

export async function getRooms(prefix: string) {
  const roomNames = await scanAll(prefix);

  if (roomNames.length === 0) {
    return [];
  }

  const dbRooms = await mgetAsync(roomNames);

  const rooms = dbRooms.map((room) => {
    const value = JSON.parse(room);
    const { name, players } = value;
    return { name, players };
  });

  return rooms;
}

export async function setRoom(roomName: string, room: Room) {
  await setAsync(roomName, JSON.stringify(room));
}
