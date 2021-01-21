import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Flex, Grid } from 'theme-ui';
import { playerDeckId } from 'utils/dom';

type Props = {
  player: PlayerState;
  isActive: boolean;
  isSpectator: boolean;
  togglePlayerActiveCard: (cardKey: string | null) => void;
  activePlayerCard: string | null;
} & BoxProps;

export const Player = ({ player, isActive, isSpectator, togglePlayerActiveCard, activePlayerCard, ...rest }: Props) => {
  if (!player) {
    return isSpectator ? null : <InvitePlayer />;
  }
  const { captured, hand, username } = player;
  return (
    <Flex {...rest} my={2}>
      <Deck cardNumber={captured.length} scopa={player.scopa} id={playerDeckId(username)} />
      <Box pl={3} />
      <Grid sx={{ alignContent: 'center', flex: 1 }} columns="1fr 1fr 1fr" gap={[2, null, 3]}>
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              id={key}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard(activePlayerCard === key ? null : key) : noop}
            >
              <Card card={c} faceDown={isSpectator} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Flex>
  );
};
