import { Socket } from 'socket.io';
import { UserEvents } from 'shared';
import { generateUsername } from './utils';
import { Store } from './Store';

export function createUsername(socket: Socket, store: Store) {
  const username = generateUsername();
  socket.emit(UserEvents.UsernameCreated, username);
}
