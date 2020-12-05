import { Button, Heading } from 'theme-ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { getUsers } from 'lib/resources';
import { useUserData } from 'components/UserContext';
import { RoomEvents } from 'shared';

export const Lobby = () => {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Socket stuff
    const handleCreateRoomSuccess = (roomName: string) => {
      console.log(RoomEvents.CreateSuccess, roomName);
      history.push(`/game/${roomName}`);
    };
    gameIO.on(RoomEvents.CreateSuccess, handleCreateRoomSuccess);

    // HTTP stuff
    getUsers.then((data) => setUsers(data.data));

    return () => {
      gameIO.off(RoomEvents.CreateSuccess, handleCreateRoomSuccess);
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
      <Button onClick={() => gameIO.emit(RoomEvents.Create)}>Create a new room</Button>
    </Layout>
  );
};
