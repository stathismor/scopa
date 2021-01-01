import { useState, useEffect } from 'react';
import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
// import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState, cardKey } from 'shared';
import { Box, BoxProps, Grid } from 'theme-ui';
import { processAnimations, AnimationGroup } from '../../lib/animations';
type Props = {
  player: PlayerState;
  isActive: boolean;
  movingCards: string[];
  togglePlayerActiveCard: React.Dispatch<React.SetStateAction<string | null>>;
  activePlayerCard: string | null;
};

export const Player = ({
  player,
  isActive,
  movingCards,
  togglePlayerActiveCard,
  activePlayerCard,
  ...rest
}: Props & BoxProps) => {
  const [animations, setAnimations] = useState<AnimationGroup | null>(null);

  useEffect(() => {
    processAnimations(setAnimations);
  }, []);

  if (!player) {
    return <div />;
    // return <InvitePlayer />;
  }

  const { captured, hand } = player;

  return (
    <Box {...rest}>
      <Grid sx={{ m: 3 }} columns="1.5fr 1fr 1fr 1fr">
        <Deck cardNumber={captured.length} scopa={player.scopa} />
        {hand?.map((c) => {
          const key = cardKey(c);

          const cardAnimation = animations?.cards.filter((card) => card.name === key)[0];

          return (
            <CardWrapper
              key={key}
              isMoving={movingCards.includes(key)}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard((state) => (state === key ? null : key)) : noop}
            >
              <Card card={c} callback={cardAnimation?.callback} />
            </CardWrapper>
          );
        })}
      </Grid>
    </Box>
  );
};
