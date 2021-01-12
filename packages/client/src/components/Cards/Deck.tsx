import { theme } from 'theme';
import { Box, BoxProps } from 'theme-ui';
import back from 'images/back.jpg';
import { baseCard, CARD_HEIGHT_DESKTOP, CARD_HEIGHT_MOBILE } from './style';
import { Card as CardType } from 'shared';
import { Card } from './Card';

type Props = {
  cardNumber: number;
  scopa?: CardType[];
  scopaPosition?: 'top' | 'bottom';
} & BoxProps;

const SCOPA_TRANSFORM_PROPERTY = {
  top: undefined,
  bottom: 'rotate(180deg)',
};

export const Deck = ({ cardNumber, scopa, id, scopaPosition = 'top', ...rest }: Props) => {
  const deckElevation = Math.floor(cardNumber / 5);
  return (
    <Box sx={{ position: 'relative' }} id={id}>
      {scopa?.map((card, i) => (
        <Box
          key={card.value + card.suit}
          sx={{
            position: 'absolute',
            zIndex: -i - 1,
            [scopaPosition]: [`-${CARD_HEIGHT_MOBILE / 5 + i * 2}vw`, null, `-${CARD_HEIGHT_DESKTOP / 5 + i * 2}vw`],
            transform: SCOPA_TRANSFORM_PROPERTY[scopaPosition],
          }}
        >
          <Card card={card} />
        </Box>
      ))}
      <Box
        sx={{
          ...baseCard,
          bg: 'muted',
          backgroundImage: cardNumber === 0 ? undefined : `url(${back})`,
          boxShadow: `0.${deckElevation}vw 0.${deckElevation}vw 0 ${theme.colors.darkGrey}`,
        }}
        {...rest}
      />
    </Box>
  );
};
