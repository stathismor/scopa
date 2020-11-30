import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Heading } from 'theme-ui';
import { SUIT } from 'utils/cardEngine';
import { range } from 'lodash';
import { Card } from 'components/Card';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';

export const Game = () => {
  const [status, setStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();

  useEffect(() => {
    gameIO.emit('join-room', roomName);

    gameIO.on('join-room-success', handleSuccess);
    gameIO.on('join-room-error', handleError);

    return () => {
      gameIO.off('join-room-success', handleSuccess);
      gameIO.off('join-room-error', handleError);
    };
  }, [roomName]);

  const handleSuccess = () => {
    setStatus('joined');
  };

  const handleError = (errorMessage: string) => {
    setStatus('failed');
    setErrorMessage(errorMessage);
  };

  const renderLayout = () => {
    return (
      <Layout>
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <Link to="/">Back</Link>
          <Heading as="h1">Scopa</Heading>
        </Flex>
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

  const renderError = () => {
    return <div>Error: {errorMessage}</div>;
  };

  const renderPending = () => {
    return <div>Pending</div>;
  };

  return (
    <div>
      {status === 'pending' && renderPending()}
      {status === 'joined' && renderLayout()}
      {status === 'failed' && renderError()}
    </div>
  );
};
