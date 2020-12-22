import { Button, Heading } from 'theme-ui';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { useUserData } from 'components/UserContext';
import { RoomEvent } from 'shared';

export const Lobby = () => {
  const history = useHistory();

  useEffect(() => {
    // Socket stuff
    const handleCreateRoomSuccess = (roomName: string) => {
      console.log(RoomEvent.CreateSuccess, roomName);
      history.push(`/game/${roomName}`);
    };
    gameIO.on(RoomEvent.CreateSuccess, handleCreateRoomSuccess);
    
    return () => {
      gameIO.off(RoomEvent.CreateSuccess, handleCreateRoomSuccess);
    };
  }, [history]);

  const { username } = useUserData();

  return (
    <Layout>
      <Heading as="h1">Scopa</Heading>
      <p>Welcome {username}</p>
      <Heading as="h2" my={2}>Start a new game</Heading>
      <Button onClick={() => gameIO.emit(RoomEvent.Create, username)}>Create a new game</Button>
    </Layout>
  );
};
