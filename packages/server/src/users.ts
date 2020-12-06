import { Socket } from 'socket.io';
import { UserEvent } from 'shared';
import { generateRoomName } from './utils';
import { Store } from './Store';

export async function createUsername(socket: Socket, store: Store) {
  const userName = generateRoomName();
  store.rooms.push(userName);
  socket.emit(UserEvent.UsernameCreated, userName);
}
