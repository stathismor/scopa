import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';

type Props = {
  player: PlayerState;
  isActive: boolean;
  isSpectator: boolean;
  togglePlayerActiveCard: React.Dispatch<React.SetStateAction<string | null>>;
  activePlayerCard: string | null;
} & BoxProps;

export const Player = ({ player, isActive, isSpectator, togglePlayerActiveCard, activePlayerCard, ...rest }: Props) => {
  if (!player) {
    return isSpectator ? null : <InvitePlayer />;
  }
  const { captured, hand } = player;
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3 }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} scopa={player.scopa} id="player-deck" />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              id={key}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard((state) => (state === key ? null : key)) : noop}
            >
              <Card card={c} faceDown={isSpectator} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
