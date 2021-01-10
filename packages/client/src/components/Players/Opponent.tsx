import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid, Text } from 'theme-ui';
import { PLAYER_DECK_ID } from 'utils/dom';

export const Opponent = ({ player, ...rest }: { player: PlayerState } & BoxProps) => {
  if (!player) {
    return <Text>Waiting for a player to join</Text>;
  }
  const { captured, hand, username, scopa } = player;
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3, marginTop: '-7vw' }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length}  scopa={scopa} id={`${PLAYER_DECK_ID}__${username}`} />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper key={key} id={key}>
              <Card card={c} faceDown />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
