import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Text } from 'theme-ui';
import { Suit } from 'shared';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';
import { RoomState, RoomEvent } from 'shared';
import { Card as CardType } from 'utils/cardEngine';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';

export const Game = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();

  useEffect(() => {
    const handleSuccess = () => {
      setStatus(RoomState.Joined);
    };

    const handleError = (errorMessage: string) => {
      setStatus(RoomState.Failed);
      setErrorMessage(errorMessage);
    };

    gameIO.emit(RoomEvent.Join, roomName, username);

    gameIO.on(RoomEvent.JoinSuccess, handleSuccess);
    gameIO.on(RoomEvent.JoinError, handleError);

    return () => {
      gameIO.off(RoomEvent.JoinSuccess, handleSuccess);
      gameIO.off(RoomEvent.JoinError, handleError);
    };
  }, [roomName, username]);

  switch (status) {
    case RoomState.Pending:
      return <div>Pending</div>;
    case RoomState.Joined:
      return (
        <Layout>
          <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
            <Link to="/">Back</Link>
          </Box>

          <GameTable>
            <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginTop: '-7vw' }}>
              {[
                [3, Suit.Golds],
                [9, Suit.Clubs],
                [7, Suit.Swords],
              ].map((c) => (
                <Card key={`${c[0]}__${c[1]}`} card={c as CardType} faceDown />
              ))}
            </Flex>
            <Text>Opponents</Text>
            <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
              <Deck cardNumber={30} title="30 cards" />
              <Box pr={5} />
              {[
                [1, Suit.Golds],
                [10, Suit.Clubs],
                [7, Suit.Cups],
                [3, Suit.Cups],
              ].map((c) => (
                <Card key={`${c[0]}__${c[1]}`} card={c as CardType} />
              ))}
            </Flex>
            <Text> You ({username})</Text>
            <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginBottom: '-3vw' }}>
              {[
                [5, Suit.Golds],
                [3, Suit.Clubs],
                [5, Suit.Swords],
              ].map((c) => (
                <Card key={`${c[0]}__${c[1]}`} card={c as CardType} />
              ))}
            </Flex>
          </GameTable>
        </Layout>
      );
    default:
    case RoomState.Failed:
      return <div>Error: {errorMessage}</div>;
  }
};
