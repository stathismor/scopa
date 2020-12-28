import { useEffect, useState } from 'react';
import { Heading, Box, Flex, Card } from 'theme-ui';
import { Room, RoomEvent } from 'shared';
import { gameIO } from '../lib/socket';
import { getRooms } from '../lib/resources';

export const RoomTable = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

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
  }, []);

  return (
    <Box>
      <Heading as="h2">Rooms</Heading>
      {rooms.map((room) => (
        <Card key={room.name} mt={1}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Box>
              Room: <strong>{room.name}</strong>
            </Box>
            <Box>
              Players: <strong>{room.players.map((player) => player.name).join(', ')}</strong>
            </Box>
          </Flex>
        </Card>
      ))}
    </Box>
  );
};