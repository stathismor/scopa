import { theme } from 'theme';
import { SxStyleProp } from 'theme-ui';

export const CARD_HEIGHT_DESKTOP = 104;
export const CARD_WIDTH_DESKTOP = 60;
export const CARD_HEIGHT_SMALL = 36;
export const CARD_WIDTH_SMALL = 22;
const NUM_CARD_ON_ROW = 5;

export const CARD_HEIGHT = `${CARD_HEIGHT_DESKTOP}px`;
export const CARD_WIDTH = `${CARD_WIDTH_DESKTOP}px`;
export const BOARD_MIN_WIDTH = `${CARD_WIDTH_DESKTOP * NUM_CARD_ON_ROW + theme.space[5]}px`;

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
});

export const cardDrop = {
  height: CARD_HEIGHT,
  width: CARD_WIDTH,
  borderRadius: 1,
  border: '3px dashed',
  borderColor: 'lightGrey',
};
