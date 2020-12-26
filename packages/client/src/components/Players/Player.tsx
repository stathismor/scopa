import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { gameIO } from 'lib/socket';
import { noop } from 'lodash';
import { useParams } from 'react-router-dom';
import { GameTurnEvent, PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';

type Props = {
  player: PlayerState;
  isActive: boolean;
  movingCards: string[];
  activePlayerCard: string | null;
};

export const Player = ({ player, isActive, movingCards, activePlayerCard, ...rest }: Props & BoxProps) => {
  const { roomName } = useParams<{ roomName: string }>();
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
              isMoving={movingCards.includes(key)}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={
                isActive
                  ? () => gameIO.emit(GameTurnEvent.SelectPlayerCard, roomName, activePlayerCard === key ? null : key)
                  : noop
              }
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
