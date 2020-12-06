import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Heading } from 'theme-ui';
import { SUIT } from 'utils/cardEngine';
import { range } from 'lodash';
import { Card } from 'components/Card';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';

import { RoomState, RoomEvent } from 'shared';

export const Game = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();

  useEffect(() => {
    const handleSuccess = () => {
      setStatus(RoomState.Joined);
    };

    const handleError = (errorMessage: string) => {
      setStatus(RoomState.Failed);
      setErrorMessage(errorMessage);
    };
    gameIO.emit(RoomEvent.Joining, roomName);

    gameIO.on(RoomEvent.JoinSuccess, handleSuccess);
    gameIO.on(RoomEvent.JoinError, handleError);

    return () => {
      gameIO.off(RoomEvent.JoinSuccess, handleSuccess);
      gameIO.off(RoomEvent.JoinError, handleError);
    };
  }, [roomName]);

  switch (status) {
    case RoomState.Pending:
      return <div>Pending</div>;
    case RoomState.Joined:
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
    case RoomState.Failed:
      return <div>Error: {errorMessage}</div>;
  }
};
