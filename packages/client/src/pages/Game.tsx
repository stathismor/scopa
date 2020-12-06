import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Text } from 'theme-ui';
import { Suit } from 'shared';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';
import { GameState, RoomEvents } from 'shared';
import { Card as CardType } from 'utils/cardEngine';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';

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
  const { userName } = useUserData();

  switch (status) {
    case GameState.Pending:
      return <div>Pending</div>;
    case GameState.Joined:
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
              <Deck cardLeft={30} title="30 cards" />
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
            <Text> You ({userName})</Text>
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
    case GameState.Failed:
      return <div>Error: {errorMessage}</div>;
  }
};
