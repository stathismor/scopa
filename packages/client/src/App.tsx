import { Card } from './Card';
import { Box, Button, Flex, Heading } from 'theme-ui';
import { SUIT } from 'cards';
import { range } from 'lodash';
import { useEffect, useState } from 'react';
// Front is served on the same domain as server
import { io } from 'socket.io-client';

const socketUrl = process.env.REACT_APP_SOCKET_URL as string;
const socket = io(socketUrl);
function App() {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Socket stuff
    socket.on('connect', () => {
      console.log(`connect ${socket.id}`);
    });

    socket.on('message2', (arg: string) => {
      console.log('message2 -', arg);
      setCount((state) => state + 1);
    });

    // HTTP stuff
    const usersUrl = `${process.env.REACT_APP_HTTP_URL}/users`;
    fetch(usersUrl)
      .then((response) => response.json())
      .then((data) => setUsers(data.data));
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        m: '0 auto',
      }}
    >
      <Heading as="h1">Scopa</Heading>
      <p>Users:</p>
      {users.map((user) => (
        <p key={user}>{user}</p>
      ))}

      <Heading as="h2">Socket id: {socket.id}</Heading>
      <Button onClick={() => socket.emit('message1', 'Hello server')}>Send message to socket {count} times</Button>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Denari]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Bastoni]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Coppe]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Spade]} />
        ))}
      </Flex>
    </Box>
  );
}

export default App;
