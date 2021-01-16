import { Box, Button, Flex, Heading, Text } from 'theme-ui';
import { GameEvent, PlayerState } from 'shared';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { groupBy, mapValues, maxBy } from 'lodash';
import { SmallCard, SmallEmptyCard } from './Cards/Card';

type Props = {
  players: PlayerState[];
};

const END_OF_GAME_SCORE = 11;

export const GameScore = ({ players }: Props) => {
  /**
   * Grouping scores by totals and check if there is the same total number more than once
   * */
  const equalScores = mapValues(groupBy(players, 'score.total'), (scores) => scores.length > 1);
  const winner = maxBy(players, 'score.total');

  /**
   * The game finish when the player with most point reach or get over end of game score
   * and there are not other players with equal score
   * */
  const isGameFinished = (winner?.score?.total ?? 0) >= END_OF_GAME_SCORE && !equalScores[`${winner?.score?.total}`];
  const { roomName } = useParams<{ roomName: string }>();

  return (
    <Box>
      <Flex sx={{ gap: 3 }}>
        {players.map(({ username, score: { details, total, totalRound } }, i) => (
          <Box key={i} sx={{ flex: '1 0 50%' }}>
            <Heading as="h3" mt={2}>
              {username}
            </Heading>
            {details?.map(({ label, value, cards }) => (
              <Box key={label}>
                <Box sx={{ alignItems: 'center' }}>
                  <Flex>
                    <Text mr={1}>{label}:</Text>
                    <Text mr={1}>{value ? 1 : '-'}</Text>
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
      </Flex>
      <Flex sx={{ flexFlow: 'column', alignItems: 'center', mt: 3 }}>
        {isGameFinished && (
          <Heading as="h2" my={3}>
            🏆🏆 Winner: {winner?.username} 🏆🏆
          </Heading>
        )}
        <Button
          onClick={() => {
            gameIO.emit(GameEvent.NewRound, roomName, isGameFinished);
          }}
        >
          {isGameFinished ? 'Restart' : 'Next Round'}
        </Button>
      </Flex>
    </Box>
  );
};
