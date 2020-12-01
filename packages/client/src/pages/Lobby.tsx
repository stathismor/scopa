import { Button, Heading } from 'theme-ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { getUsers } from 'lib/resources';
import { useUserData } from 'components/UserContext';

export const Lobby = () => {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Socket stuff
    const handleCreateRoomSuccess = (roomName: string) => {
      console.log('create-room-success', roomName);
      history.push(`/game/${roomName}`);
    };
    gameIO.on('create-room-success', handleCreateRoomSuccess);

    // HTTP stuff
    getUsers.then((data) => setUsers(data.data));

    return () => {
      gameIO.off('create-room-success', handleCreateRoomSuccess);
    };
  }, [history]);

  const { userName } = useUserData();

  return (
    <Layout>
      <Heading as="h1">Scopa</Heading>
      <p>Welcome {userName}</p>
      {users.map((user) => (
        <p key={user}>{user}</p>
      ))}

      <Heading as="h2">Socket id: {gameIO.id}</Heading>
      <Button onClick={() => gameIO.emit('create-room')}>Create a new room</Button>
    </Layout>
  );
};
