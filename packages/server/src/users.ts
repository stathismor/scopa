import { Socket } from 'socket.io';
import { UserEvents } from 'shared';
import { generateRoomName } from './utils';
import { Store } from './Store';

export async function createUsername(socket: Socket, store: Store) {
  const userName = generateRoomName();
  store.rooms.push(userName);
  socket.emit(UserEvents.UsernameCreated, userName);
}
