import { Heading, Box, Flex } from 'theme-ui';
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
      <Box as="ul">
        {rooms.map((room) => (
          <Flex key={room.name} as="li" bg="primary" sx={{ flexDirection: 'column', mt: 1 }}>
            <Flex>
              Room:<strong>{room.name}</strong>
            </Flex>
            <Flex>
              Players:<strong>{room.players.map((player) => player.name).join(', ')}</strong>
            </Flex>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};
