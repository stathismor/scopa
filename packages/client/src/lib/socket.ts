// Front is served on the same domain as server
import { io } from 'socket.io-client';

export const gameIO = io(process.env.REACT_APP_SOCKET_URL as string);
