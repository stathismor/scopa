import { Box, Button, Flex, Heading, Text } from 'theme-ui';
import { GameEvent, Score } from 'shared';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { groupBy, mapValues, maxBy } from 'lodash';

type Props = {
  gameScore: Score[];
};

const END_OF_GAME_SCORE = 11;

export const GameScore = ({ gameScore }: Props) => {
  /**
   * Grouping scores by totals and check if there is the same total number more than once
   * */
  const equalScores = mapValues(groupBy(gameScore, 'total'), (scores) => scores.length > 1);
  const winner = maxBy(gameScore, 'total');

  /**
   * The game finish when the player with most point reach or get over end of game score
   * and there are not other players with equal score
   * */
  const isGameFinished = (winner?.total ?? 0) >= END_OF_GAME_SCORE && !equalScores[`${winner?.total}`];
  const { roomName } = useParams<{ roomName: string }>();

  return (
    <Box>
      <Flex sx={{ gap: 3 }}>
        {gameScore.map(({ details, total, username }, i) => (
          <Box key={i}>
            <Heading as="h3" mt={2}>
              {username}
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
        {isGameFinished && (
          <Heading as="h2" my={3}>
            🏆🏆 Winner: {winner?.username} 🏆🏆
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
