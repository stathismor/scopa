import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState, cardKey, PlayerAction, PlayerActionType } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';
import { MOVE_TO } from './constants';

type Props = {
  player: PlayerState;
  isActive: boolean;
  togglePlayerActiveCard: React.Dispatch<React.SetStateAction<string | null>>;
  activePlayerCard: string | null;
  action: PlayerAction;
};

export const Player = ({
  player,
  isActive,
  togglePlayerActiveCard,
  activePlayerCard,
  action,
  ...rest
}: Props & BoxProps) => {
  if (!player) {
    return <InvitePlayer />;
  }
  const { captured, hand } = player;
  const moveTo =
    action?.action === PlayerActionType.Capture
      ? MOVE_TO.player
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3 }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} scopa={player.scopa} />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              isMoving={action?.card === key}
              moveTo={moveTo}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard((state) => (state === key ? null : key)) : noop}
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
