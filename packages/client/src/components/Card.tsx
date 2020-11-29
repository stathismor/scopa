import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'theme-ui';
import { startCase } from 'lodash';
import bg from 'images/cards.jpg';
import { SUIT, Card as CardType } from 'utils/cardEngine';

const VALUES: { [key: number]: string } = {
  1: 'Ace',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Knave',
  9: 'Knight',
  10: 'King',
};

function name([value, suit]: CardType) {
  return `${VALUES[value]} of ${SUIT[startCase(suit)]}`;
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
