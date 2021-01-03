import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';
import { AnimationGroup } from '../../lib/animations';
type Props = {
  player: PlayerState;
  isActive: boolean;
  movingCards: string[];
  togglePlayerActiveCard: React.Dispatch<React.SetStateAction<string | null>>;
  activePlayerCard: string | null;
  animationGroup: AnimationGroup | null;
};

export const Player = ({
  player,
  isActive,
  movingCards,
  togglePlayerActiveCard,
  activePlayerCard,
  animationGroup,
  ...rest
}: Props & BoxProps) => {
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

          const cardAnimation = animationGroup
            ? animationGroup.filter((animation) => animation.cards.filter((card) => card === key)[0])[0]
            : null;

          return (
            <CardWrapper
              key={key}
              isMoving={movingCards.includes(key)}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard((state) => (state === key ? null : key)) : noop}
            >
              <Card card={c} animation={cardAnimation?.config} callback={cardAnimation?.callback} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
