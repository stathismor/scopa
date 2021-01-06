import { theme } from 'theme';
import { Box, BoxProps } from 'theme-ui';
import back from 'images/back.jpg';
import { baseCard, CARD_HEIGHT_DESKTOP, CARD_HEIGHT_MOBILE } from './style';
import { Card as CardType } from 'shared';
import { Card } from './Card';

export const Deck = ({ cardNumber, scopa, id, ...rest }: { cardNumber: number; scopa?: CardType[] } & BoxProps) => {
  const deckElevation = Math.floor(cardNumber / 5);
  return (
    <Box sx={{ position: 'relative' }} id={id}>
      {scopa?.map((card, i) => (
        <Box
          key={card.value + card.suit}
          sx={{
            position: 'absolute',
            zIndex: -i - 1,
            top: [
              `calc(-${CARD_HEIGHT_MOBILE / 10}vw - ${i * 10}px)`,
              null,
              `calc(-${CARD_HEIGHT_DESKTOP / 10}vw - ${i * 10}px)`,
            ],
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
