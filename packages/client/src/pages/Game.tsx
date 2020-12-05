import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Heading } from 'theme-ui';
import { SUIT } from 'utils/cardEngine';
import { range } from 'lodash';
import { Card } from 'components/Card';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';

import { GameState, RoomEvents } from 'shared';

export const Game = () => {
  const [status, setStatus] = useState<GameState>(GameState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();

  useEffect(() => {
    const handleSuccess = () => {
      setStatus(GameState.Joined);
    };

    const handleError = (errorMessage: string) => {
      setStatus(GameState.Failed);
      setErrorMessage(errorMessage);
    };
    gameIO.emit(RoomEvents.Joining, roomName);

    gameIO.on(RoomEvents.JoinSuccess, handleSuccess);
    gameIO.on(RoomEvents.JoinError, handleError);

    return () => {
      gameIO.off(RoomEvents.JoinSuccess, handleSuccess);
      gameIO.off(RoomEvents.JoinError, handleError);
    };
  }, [roomName]);

  switch (status) {
    case GameState.Pending:
      return <div>Pending</div>;
    case GameState.Joined:
      return (
        <Layout>
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Link to="/">Back</Link>
            <Heading as="h1">Scopa</Heading>
          </Flex>
          <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
            {range(1, 11).map((r) => (
              <Card key={r} card={[r, SUIT.Golds]} faceDown />
            ))}
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
    default:
    case GameState.Failed:
      return <div>Error: {errorMessage}</div>;
  }
};
