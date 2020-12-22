import { theme } from 'theme';
import { Box, BoxProps } from 'theme-ui';
import back from 'images/back.jpg';
import { baseCard } from './style';

export const Deck = ({ cardNumber, ...rest }: { cardNumber: number } & BoxProps) => {
  const deckElevation = Math.floor(cardNumber / 5);
  return (
    <Box
      sx={{
        ...baseCard,
        bg: 'muted',
        backgroundImage: cardNumber === 0 ? undefined : `url(${back})`,
        boxShadow: `0.${deckElevation}vw 0.${deckElevation}vw 0 ${theme.colors.darkGrey}`,
      }}
      {...rest}
    />
  );
};
