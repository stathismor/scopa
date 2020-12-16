import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { PlayerState } from 'shared';
import { Box, BoxProps, Flex, Text } from 'theme-ui';
import { cardKey } from 'utils/cards';

export const Opponent = ({ player, ...rest }: { player: PlayerState } & BoxProps) => {
  if (!player) {
    return <Text>Waiting for a player to join</Text>;
  }
  const { username, captured, hand } = player;
  return (
    <Box {...rest}>
      <Text>{username}</Text>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginBottom: '-7vw' }}>
        <Deck cardNumber={captured.length} />
        {hand?.map((c) => (
          <Card key={cardKey(c)} card={c} faceDown />
        ))}
      </Flex>
    </Box>
  );
};
