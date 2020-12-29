import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { PlayerState, cardKey, PlayerAction, PlayerActionType } from 'shared';
import { Box, BoxProps, Grid, Text } from 'theme-ui';
import { MOVE_TO } from './constants';

export const Opponent = ({ player, action, ...rest }: { player: PlayerState; action?: PlayerAction } & BoxProps) => {
  if (!player) {
    return <Text>Waiting for a player to join</Text>;
  }
  const moveTo =
    action?.action === PlayerActionType.Capture
      ? MOVE_TO.opponent
      : { x: window.innerWidth / 2, y: -window.innerHeight / 2 };
  const { captured, hand } = player;
  return (
    <Box {...rest}>
      <Grid sx={{ m: 3, marginBottom: '-7vw' }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} />
        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper key={key} isMoving={action?.card === key} moveTo={moveTo}>
              <Card card={c} faceDown={action?.card !== key} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
