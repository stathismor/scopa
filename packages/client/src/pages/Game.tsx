import { Button, Flex, Heading } from 'theme-ui';
import { SUIT } from 'utils/cardEngine';
import { range } from 'lodash';
import { Card } from 'components/Card';
import { Link, useParams } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { useEffect, useState } from 'react';
import { gameIO } from 'api/socket';

export const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleRoom = async (socket: any) => {
      console.log(socket);
      await socket.join(gameId);
      socket.to(gameId).emit('message1', 'Hello server from room' + gameId);
    };
    gameIO.on('connection', handleRoom);

    const handleMessage = (arg: string) => {
      console.log('message2 -', arg);
      setCount((state) => state + 1);
    };

    gameIO.on('message2', handleMessage);

    return () => {
      gameIO.off('connection', handleRoom);
      gameIO.off('message2', handleMessage);
    };
  });
  return (
    <Layout>
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Link to="/">Back</Link>
        <Heading as="h1">Scopa</Heading>
      </Flex>
      <Button onClick={() => gameIO.emit('message1', 'Hello server')}>Send message to socket {count} times</Button>

      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Golds]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Clubs]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Cups]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Swords]} />
        ))}
      </Flex>
    </Layout>
  );
};
