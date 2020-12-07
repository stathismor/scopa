import { Socket } from 'socket.io';
import { UserEvent } from 'shared';
import { generateUsername } from './utils';
import { Store } from './Store';

export function createUsername(socket: Socket, store: Store) {
  const username = generateUsername();
  socket.emit(UserEvent.UsernameCreated, username);
}
