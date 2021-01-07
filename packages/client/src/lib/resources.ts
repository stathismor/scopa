import { http } from 'utils/rest';

export const getRooms = () => http.get('/rooms');

export const deleteRoom = ({ roomName, username }: { roomName: string; username: string }) =>
  http.delete(`/rooms/${roomName}`, { username });
