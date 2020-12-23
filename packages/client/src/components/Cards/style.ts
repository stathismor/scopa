import { theme } from 'theme';
import { SxStyleProp } from 'theme-ui';

export const CARD_HEIGHT_MOBILE = 26;
export const CARD_HEIGHT_DESKTOP = 13;
export const CARD_WIDTH_MOBILE = 15;
export const CARD_WIDTH_DESKTOP = 7.5;
const NUM_CARD_ON_ROW = 5;

export const CARD_HEIGHT = [`${CARD_HEIGHT_MOBILE}vw`, null, `${CARD_HEIGHT_DESKTOP}vw`];
export const CARD_WIDTH = [`${CARD_WIDTH_MOBILE}vw`, null, `${CARD_WIDTH_DESKTOP}vw`];
export const BOARD_MIN_WIDTH = [
  `calc(${CARD_WIDTH_MOBILE * NUM_CARD_ON_ROW}vw + ${theme.space[4]}px)`,
  null,
  `calc(${CARD_WIDTH_DESKTOP * NUM_CARD_ON_ROW}vw + ${theme.space[5]}px)`,
];

export const baseCard = {
  height: CARD_HEIGHT,
  width: CARD_WIDTH,
  borderRadius: 1,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
};

export const cardWrapper = (isActive: boolean): SxStyleProp => ({
  position: 'relative',
  '&::after': isActive
    ? {
        content: "''",
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        border: '2px solid',
        borderColor: 'primary',
        borderRadius: 1,
      }
    : undefined,
});

export const playerCardWrapper = (isActive: boolean): SxStyleProp => ({
  ...cardWrapper(isActive),
  transition: 'transform 0.3s ease-in-out',
  transform: isActive ? 'translateY(-3.5vw)' : undefined,
  '&:hover': {
    transform: 'translateY(-3.5vw)',
  },
});

export const cardDrop = {
  height: CARD_HEIGHT,
  width: CARD_WIDTH,
  borderRadius: 1,
  border: '3px dashed',
  borderColor: 'lightGrey',
};
