import React from 'react';
import { Box } from 'theme-ui';
import { startCase } from 'lodash';

import { Suit, Card as CardType } from 'shared';
import back from 'images/back.jpg';
import { baseCard } from './style';

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

function name({ value, suit }: CardType) {
  return `${VALUES[value]} of ${Suit[startCase(suit)]}`;
}

function imgUrl({ value, suit }: CardType) {
  return require(`images/${suit.toLowerCase()}/${`${value}`.padStart(2, '0')}.jpg`).default;
}

interface CardProps {
  faceDown?: boolean;
  card: CardType;
}

export const Card = ({ faceDown = false, card }: CardProps) => {
  return (
    <Box
      sx={{
        ...baseCard,
        backgroundImage: `url(${faceDown ? back : imgUrl(card)})`,
      }}
      title={faceDown ? 'card' : name(card)}
    />
  );
};
