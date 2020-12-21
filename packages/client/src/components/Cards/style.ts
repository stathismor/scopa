import { SxStyleProp } from 'theme-ui';

export const baseCard = {
  height: ['26vw', null, '13vw'],
  width: ['15vw', null, '7.5vw'],
  borderRadius: 1,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
};

export const mainDeckPosition: SxStyleProp = {
  position: 'absolute',
  top: ['-3vw', null, '2vw'],
  right: ['-3vw', null, '2vw'],
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
  height: ['26vw', null, '13vw'],
  width: ['15vw', null, '7.5vw'],
  borderRadius: 1,
  border: '3px dashed',
  borderColor: 'lightGrey',
};
