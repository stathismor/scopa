import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { useEffect, useState } from 'react';
import { PlayerState, cardKey, PlayerAction, PlayerActionType } from 'shared';
import { Box, BoxProps, Grid, Text } from 'theme-ui';
import { CAPTURE_CARDS_TARGET, PLAY_CARD_TARGET } from './constants';

export const Opponent = ({ player, action, ...rest }: { player: PlayerState; action?: PlayerAction } & BoxProps) => {
  const [moveTo, setMoveTo] = useState<typeof CAPTURE_CARDS_TARGET['player'] | null>(null);
  useEffect(() => {
    setMoveTo(PLAY_CARD_TARGET.opponent);
  }, [action]);
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
              moveTo={action?.card === key ? moveTo : null}
              onRest={() => {
                setTimeout(() => {
                  action?.action === PlayerActionType.Capture && setMoveTo(CAPTURE_CARDS_TARGET.opponent);
                }, 600);
              }}
            >
              <Card card={c} faceDown={action?.card !== key} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
