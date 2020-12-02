import { Socket } from 'socket.io';
import { generateRoomName } from './utils';
import { Store } from './Store';

// TODO this will need to move to a shared lib
// type UserEvents = typeof USER_EVENTS[keyof typeof USER_EVENTS];
export const USER_EVENTS = {
  UserNameCreated: 'username-created',
  UserNameMissing: 'username-missing',
} as const;

export async function createUserName(socket: Socket, store: Store) {
  const userName = generateRoomName();
  store.rooms.push(userName);
  socket.emit(USER_EVENTS.UserNameCreated, userName);
}
