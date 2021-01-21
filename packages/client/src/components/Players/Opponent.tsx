import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Flex, Grid, Text } from 'theme-ui';
import { playerDeckId } from 'utils/dom';

type Props = {
  player: PlayerState;
  activePlayerCard: string | null;
} & BoxProps;

export const Opponent = ({ player, activePlayerCard, ...rest }: Props) => {
  if (!player) {
    return <Text>Waiting for a player to join</Text>;
  }
  const { captured, hand, username, scopa } = player;

  return (
    <Flex {...rest} sx={{ m: 2, marginTop: '-7vw' }}>
      <Deck cardNumber={captured.length} scopa={scopa} id={playerDeckId(username)} scopaPosition="bottom" />
      <Box pl={3} />
      <Grid sx={{ alignContent: 'center', flex: 1 }} columns="1fr 1fr 1fr" gap={[2, null, 3]}>
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper key={key} id={key}>
              <Card card={c} faceDown={key !== activePlayerCard} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Flex>
  );
};
