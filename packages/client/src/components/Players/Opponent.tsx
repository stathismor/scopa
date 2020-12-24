import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { PlayerState } from 'shared';
import { Box, BoxProps, Grid, Text } from 'theme-ui';
import { cardKey } from 'utils/cards';

export const Opponent = ({
  player,
  movingCards,
  ...rest
}: { player: PlayerState; movingCards: string[] } & BoxProps) => {
  if (!player) {
    return <Text>Waiting for a player to join</Text>;
  }
  const { captured, hand } = player;
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3, marginBottom: '-7vw' }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              isMoving={movingCards.includes(key)}
            >
              <Card card={c} faceDown={!movingCards.includes(key)} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
