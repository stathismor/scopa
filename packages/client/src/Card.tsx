import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'theme-ui';
import { startCase } from 'lodash';
import bg from './images/cards.jpg';
import { SUIT, Card as CardType } from './cards';

const VALUES: { [key: number]: string } = {
  1: 'Asso',
  2: 'Due',
  3: 'Tre',
  4: 'Quattro',
  5: 'Cinque',
  6: 'Sei',
  7: 'Sette',
  8: 'Fante',
  9: 'Cavallo',
  10: 'Re',
};

function name([value, suit]: CardType) {
  return `${VALUES[value]} di ${SUIT[startCase(suit)]}`;
}

const suitList = Object.values(SUIT);
function bgPosition([value, suit]: CardType) {
  return `${(value - 1) * 11}% ${suitList.indexOf(suit) * 33}%`;
}

const face = {
  height: '13vw',
  width: '7.5vw',
  borderRadius: '0.75vw',
  boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
  backgroundImage: `url(${bg})`,
  backgroundSize: '1040%',
};

const Back = styled('div')`
  height: 13.5vw;
  width: 7.5vw;
  border-radius: 0.75vw;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  background-color: blue;
  border: 1px solid white;
`;

interface CardProps {
  className?: string;
  faceDown?: boolean;
  card: CardType;
}

export const Card = ({ className, faceDown = false, card }: CardProps) => {
  return faceDown ? (
    <Back className={className} />
  ) : (
    <Box
      sx={{
        ...face,
        backgroundPosition: bgPosition(card),
      }}
      title={name(card)}
    />
  );
};
