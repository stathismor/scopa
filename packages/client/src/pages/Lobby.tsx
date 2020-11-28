import { Button, Heading } from 'theme-ui';
import { useEffect, useState } from 'react';

import { gameIO } from 'api/socket';
import { Layout } from 'components/Layout';
import { Link } from 'react-router-dom';
import { getUsers } from 'api/resources';

export const Lobby = () => {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Socket stuff
    gameIO.on('connect', () => {
      console.log(`connect ${gameIO.id}`);
    });

    const handleMessage = (arg: string) => {
      console.log('message2 -', arg);
      setCount((state) => state + 1);
    }

    gameIO.on('message2', handleMessage);

    // HTTP stuff
    getUsers.then((data) => setUsers(data.data));

    // Cleanup
    return () => {
      gameIO.off('message2', handleMessage)
    }
  }, []);

  return (
    <Layout>
      <Heading as="h1">Scopa</Heading>
      <p>Users:</p>
      {users.map((user) => (
        <p key={user}>{user}</p>
      ))}

      <Heading as="h2">Socket id: {gameIO.id}</Heading>
      <Button onClick={() => gameIO.emit('message1', 'Hello server')}>Send message to socket {count} times</Button>
      <Link to={`/game/${gameIO.id}`}>Create a game</Link>
    </Layout>
  );
};
