import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';
import { PLAYER_DECK_ID } from 'utils/dom';

type Props = {
  player: PlayerState;
  isActive: boolean;
  togglePlayerActiveCard: (cardKey: string | null) => void;
  activePlayerCard: string | null;
};

export const Player = ({ player, isActive, togglePlayerActiveCard, activePlayerCard, ...rest }: Props & BoxProps) => {
  if (!player) {
    return <InvitePlayer />;
  }
  const { captured, hand, username } = player;
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3 }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} scopa={player.scopa} id={`${PLAYER_DECK_ID}__${username}`} />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              id={key}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard(activePlayerCard === key ? null : key) : noop}
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
