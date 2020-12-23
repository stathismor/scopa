import { Box, Flex, Heading, Text } from 'theme-ui';
import { GameState, Score } from 'shared';

type Props = {
  gameScore: Score[];
  gameState: GameState;
};

export const GameScore = ({ gameScore, gameState }: Props) => {
  return (
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
  );
};
