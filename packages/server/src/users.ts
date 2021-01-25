import { Socket } from 'socket.io';
import { UserEvent } from 'shared';
import { generateUniqueName } from './utils';

export function createUsername(socket: Socket) {
  const username = generateUniqueName();
  socket.emit(UserEvent.UsernameCreated, username);
}
