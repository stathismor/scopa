import { Box, Button, Flex, Heading, Image, Text } from 'theme-ui';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi';

import { RoomEvent } from 'shared';
import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { useUserData } from 'components/UserContext';
import { RoomTable } from 'components/RoomTable';
import logo from 'images/logo.svg';
import { Username } from 'components/Username';

export const Lobby = () => {
  const history = useHistory();
  const { username } = useUserData();

  useEffect(() => {
    const handleCreateRoomSuccess = (roomId: string) => {
      history.push(`/game/${roomId}`);
    };
    gameIO.on(RoomEvent.CreateSuccess, handleCreateRoomSuccess);

    return () => {
      gameIO.off(RoomEvent.CreateSuccess, handleCreateRoomSuccess);
    };
  }, [history]);

  return (
    <Layout>
      <Flex sx={{ alignItems: 'center', gap: 2, mt: 2 }}>
        <Image src={logo} width={50} />
        <Heading as="h1">The Two of Spades</Heading>
      </Flex>

      <Flex sx={{ alignItems: 'center', mt: 2 }}>
        <Text>Welcome</Text>
        <Box ml={2} />
        <Username />
      </Flex>
      <p>Let's Play</p>
      <Heading as="h2" my={2}>
        Available games
      </Heading>
      <ul>
        <Flex as="li" sx={{ alignItems: 'center', mt: 3 }}>
          <Heading as="h3">Scopa</Heading>
          <Button
            variant="outline"
            sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 3 }}
            onClick={() => gameIO.emit(RoomEvent.Create)}
          >
            Create a new game <FiArrowRightCircle />
          </Button>
        </Flex>
        <Flex as="li" sx={{ alignItems: 'center', mt: 3 }}>
          <Heading as="h3">Briscola 🔜</Heading>
        </Flex>
      </ul>
      <RoomTable username={username} />
    </Layout>
  );
};
