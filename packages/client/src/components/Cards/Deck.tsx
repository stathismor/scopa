import { theme } from 'theme';
import { Box, BoxProps } from 'theme-ui';
import back from 'images/back.jpg';
import { baseCard } from './style';

export const Deck = ({ cardLeft, ...rest }: { cardLeft: number } & BoxProps) => {
  const deckElevation = Math.floor(cardLeft / 5);
  return (
    <Box
      sx={{
        ...baseCard,
        bg: 'muted',
        backgroundImage: cardLeft === 0 ? undefined : `url(${back})`,
        boxShadow: `${deckElevation}px ${deckElevation}px 0 ${theme.colors.darkGrey}`,
      }}
      {...rest}
    />
  );
};
