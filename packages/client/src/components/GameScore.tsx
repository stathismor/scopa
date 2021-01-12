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
  const { players } = gameState;
  const totals = Object.fromEntries(gameScore.map((g, i) => [players[i].username, g.total]));

  const isGameFinished =
    totals[players[0].username] !== totals[players[1].username]
      ? totals[players[0].username] >= END_OF_GAME_SCORE || totals[players[1].username] >= END_OF_GAME_SCORE
      : false;

  const winner =
    isGameFinished &&
    (totals[players[0].username] > totals[players[1].username] ? players[0].username : players[1].username);

  const { roomName } = useParams<{ roomName: string }>();

  return (
    <Box>
      <Flex sx={{ gap: 3 }}>
        {gameScore.map(({ details, total }, i) => (
          <Box key={i}>
            <Heading as="h3" mt={2}>
              {players[i].username}
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
      <Flex sx={{ flexFlow: 'column', alignItems: 'center', mt: 3 }}>
        {winner && (
          <Heading as="h2" my={3}>
            🏆🏆 Winner: {winner} 🏆🏆
          </Heading>
        )}
        <Button
          onClick={() => {
            /* TODO Right now both statuses (restart or next round) do the same thing do we need to differentiate? */
            gameIO.emit(GameEvent.NewRound, roomName);
          }}
        >
          {isGameFinished ? 'Restart' : 'Next Round'}
        </Button>
      </Flex>
    </Box>
  );
};
