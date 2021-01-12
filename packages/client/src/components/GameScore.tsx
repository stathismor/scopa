import { Box, Button, Flex, Heading, Text } from 'theme-ui';
import { GameState, GameEvent, Score } from 'shared';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';

type Props = {
  gameScore: Score[];
  gameState: GameState;
};

const END_OF_GAME_SCORE = 11;

export const GameScore = ({ gameScore, gameState }: Props) => {
  const isTheGameFinished = gameScore.find((g) => g.total > END_OF_GAME_SCORE);
  const { roomName } = useParams<{ roomName: string }>();

  return (
    <Box>
      <Flex sx={{ gap: 3 }}>
        {gameScore.map(({ details, total }, i) => (
          <Box key={i}>
            <Heading as="h3" mt={2}>
              {gameState.players[i].username}
            </Heading>
            {details.map(({ label, value }) => (
              <Flex key={label}>
                <Text mr={1}>{label}:</Text>
                <Text mr={1}>{value ?? '-'}</Text>
              </Flex>
            ))}
            <Text sx={{ fontWeight: 700 }}>Total: {total}</Text>
          </Box>
        ))}
      </Flex>
      <Flex sx={{ justifyContent: 'center', mt: 3 }}>
        <Button
          onClick={() => {
            gameIO.emit(GameEvent.NewRound, roomName, gameState.activePlayer);
          }}
        >
          {isTheGameFinished ? 'Restart' : 'Next Round'}
        </Button>
      </Flex>
    </Box>
  );
};
