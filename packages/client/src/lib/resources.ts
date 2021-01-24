import { http } from 'utils/rest';

export const getRooms = () => http.get('/rooms');

export const deleteRoom = ({ roomId, username }: { roomId: string; username: string }) =>
  http.delete(`/rooms/${roomId}`, { username });
