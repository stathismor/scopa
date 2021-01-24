import { Box, Button, Flex, Heading, Text, Grid } from 'theme-ui';
import { GameEvent, GameStatus, PlayerState, RoomEvent } from 'shared';
import { gameIO } from 'lib/socket';
import { useHistory, useParams } from 'react-router-dom';
import { SmallCard, SmallEmptyCard } from './Cards/Card';
import { useEffect } from 'react';

type Props = {
  players: PlayerState[];
  gameStatus: GameStatus;
};

export const GameScore = ({ players, gameStatus }: Props) => {
  const { roomName } = useParams<{ roomName: string }>();
  const isGameFinished = gameStatus === GameStatus.Ended;
  const winner = players.find((p) => p.score.isWinning);
  const history = useHistory();

  useEffect(() => {
    const handleCreateRoomSuccess = (roomName: string) => {
      history.push(`/game/${roomName}`);
    };
    gameIO.on(RoomEvent.CreateSuccess, handleCreateRoomSuccess);

    return () => {
      gameIO.off(RoomEvent.CreateSuccess, handleCreateRoomSuccess);
    };
  }, [history]);
  return (
    <Box sx={{ maxWidth: '100%', px: 3 }}>
      <Grid gap={3} columns="1fr 1fr">
        {players.map(({ username, score: { details, total, totalRound } }, i) => (
          <Box key={i}>
            <Heading as="h3" mt={2}>
              {username}
            </Heading>
            {details?.map(({ label, value, cards }) => (
              <Box key={label}>
                <Box sx={{ alignItems: 'center' }}>
                  <Flex>
                    <Text mr={1}>{label}:</Text>
                    <Text mr={1}>{value || '-'}</Text>
                  </Flex>
                  <Box sx={{ overflowX: 'auto', p: 1 }}>
                    {cards?.length ? (
                      <Flex sx={{ gap: 2 }}>
                        {cards?.map((c) => (
                          <SmallCard key={c.suit + c.value} card={c} />
                        ))}
                      </Flex>
                    ) : (
                      <SmallEmptyCard />
                    )}
                  </Box>
                </Box>
              </Box>
            ))}

            <Text sx={{ fontWeight: 700 }}>Total Round: {totalRound}</Text>
            <Text sx={{ fontWeight: 700 }}>Total: {total}</Text>
          </Box>
        ))}
      </Grid>
      <Flex sx={{ flexFlow: 'column', alignItems: 'center', mt: 3 }}>
        {isGameFinished && (
          <Heading as="h2" my={3}>
            🏆🏆 Winner: {winner?.username} 🏆🏆
          </Heading>
        )}
        <Button
          onClick={() => {
            isGameFinished ? gameIO.emit(RoomEvent.Create) : gameIO.emit(GameEvent.NewRound, roomName);
          }}
        >
          {isGameFinished ? 'Restart' : 'Next Round'}
        </Button>
      </Flex>
    </Box>
  );
};
