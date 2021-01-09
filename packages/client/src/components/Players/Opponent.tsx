import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid, Text } from 'theme-ui';

export const Opponent = ({ player, ...rest }: { player: PlayerState } & BoxProps) => {
  if (!player) {
    return <Text>Waiting for a player to join</Text>;
  }
  const { captured, hand, scopa } = player;
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3, marginBottom: '-7vw' }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} scopa={scopa} />
        {hand?.map((c) => (
          <Card key={cardKey(c)} card={c} faceDown />
        ))}
      </Grid>
    </Box>
  );
};
