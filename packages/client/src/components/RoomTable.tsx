import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Heading, Box, Flex, Card, Button } from 'theme-ui';
import { Room, RoomEvent } from 'shared';
import { gameIO } from '../lib/socket';
import { getRooms } from '../lib/resources';
import { post } from '../utils/rest';

export const RoomTable = ({ username }: { username: string }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const history = useHistory();

  useEffect(() => {
    getRooms().then((data) => {
      setRooms(data);
    });

    const handleRoomUpdate = (rooms: Room[]) => {
      setRooms(rooms);
    };
    gameIO.on(RoomEvent.Update, handleRoomUpdate);

    return () => {
      gameIO.off(RoomEvent.Update, handleRoomUpdate);
    };
  }, [history]);

  const joinRoom = (roomName: string) => {
    history.push(`/game/${roomName}`);
  };

  const deleteRoom = (roomName: string, username: string) => {
    post(`/rooms/${roomName}`, { username });
  };

  const canDelete = (room: Room) => {
    return room.owner === username;
  };

  return (
    <Box>
      <Heading as="h2">Rooms</Heading>
      {rooms.map((room) => (
        <Card key={room.name} mt={1}>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Box>
                Room: <strong>{room.name}</strong>
              </Box>
              <Box>
                Players: <strong>{room.players.map((player) => player.name).join(', ')}</strong>
              </Box>
            </Flex>
            <Box>
              <Button variant="outline" onClick={() => joinRoom(room.name)}>
                Join
              </Button>
              <Button variant="outline" disabled={!canDelete(room)} onClick={() => deleteRoom(room.name, username)}>
                Delete
              </Button>
            </Box>
          </Flex>
        </Card>
      ))}
    </Box>
  );
};
