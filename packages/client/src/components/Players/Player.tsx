import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { PlayerState, cardKey, PlayerAction, PlayerActionType } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';
import { CAPTURE_CARDS_TARGET } from './constants';

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
  const [moveTo, setMoveTo] = useState<typeof CAPTURE_CARDS_TARGET['player'] | null>(null);
  useEffect(() => {
    setMoveTo({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, [action]);
  if (!player) {
    return <InvitePlayer />;
  }
  const { captured, hand } = player;

  return (
    <Box {...rest}>
      <Grid sx={{ m: 3 }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} scopa={player.scopa} />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              moveTo={action?.card === key ? moveTo : null}
              onRest={() => {
                setTimeout(() => {
                  action?.action === PlayerActionType.Capture && setMoveTo(CAPTURE_CARDS_TARGET.player);
                }, 600);
              }}
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
