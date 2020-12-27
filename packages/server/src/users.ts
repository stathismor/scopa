import { Socket } from 'socket.io';
import { UserEvent } from 'shared';
import { generateUsername } from './utils';

export function createUsername(socket: Socket) {
  const username = generateUsername();
  socket.emit(UserEvent.UsernameCreated, username);
}
