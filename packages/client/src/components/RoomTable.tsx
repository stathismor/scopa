import { useEffect } from 'react';
import { Link, Heading, Box, Flex, Card, Button, Grid } from 'theme-ui';
import { Room, RoomEvent } from 'shared';
import { gameIO } from '../lib/socket';
import { getRooms, deleteRoom } from '../lib/resources';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const RoomTable = ({ username }: { username: string }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Room[]>('rooms', getRooms);

  const { mutate } = useMutation(deleteRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
    },
  });

  useEffect(() => {
    const handleRoomUpdate = (rooms: Room[]) => {
      queryClient.setQueryData('rooms', rooms);
    };
    gameIO.on(RoomEvent.Update, handleRoomUpdate);
    return () => {
      gameIO.off(RoomEvent.Update, handleRoomUpdate);
    };
  }, [queryClient]);

  const canDelete = (room: Room) => {
    return room.owner === username;
  };
  return (
    <Box>
      <Heading as="h2">Rooms</Heading>
      {isLoading && 'Loading ...'}
      <Grid columns={['auto', null, '1fr 1fr 1fr']}>
        {data?.map((room) => (
          <Card key={room._id} mt={1}>
            <Flex sx={{ flexFlow: 'column', justifyContent: 'space-between' }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <Box>
                  Room: <strong>{room.name}</strong>
                </Box>
                <Box>
                  Players: <strong>{room.players.map((player) => player.name).join(', ')}</strong>
                </Box>
              </Flex>
              <Flex sx={{ alignItems: 'center', mt: 1 }}>
                <Link href={`/game/${room._id}`}>
                  <Button>Join</Button>
                </Link>
                <Box sx={{ mx: 1 }} />
                <Button
                  variant="outline"
                  disabled={!canDelete(room)}
                  onClick={() => mutate({ roomId: room._id, username })}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};
