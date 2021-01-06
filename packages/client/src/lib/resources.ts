import { http } from 'utils/rest';

export const getRooms = () => http.get('/rooms');

export type DeleteRoomPlayload = { roomName: string; username: string };
export const deleteRoom = ({ roomName, username }: DeleteRoomPlayload) =>
  http.delete(`/rooms/${roomName}`, { username });
