import { Heading, Box, Flex, Card } from 'theme-ui';
import { useEffect, useState } from 'react';
import { Room } from 'shared';
import { getRooms } from '../lib/resources';

export const RoomTable = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    getRooms.then((data) => setRooms(data));
  }, []);

  return (
    <Box>
      <Heading as="h2">Rooms</Heading>
      <Box>
        {rooms.map((room) => (
          <Card key={room.name} as="ul" mt={1}>
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
    </Box>
  );
};
