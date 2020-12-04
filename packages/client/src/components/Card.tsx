import React from 'react';
import { Box } from 'theme-ui';
import { padStart, startCase } from 'lodash';
import { SUIT, Card as CardType } from 'utils/cardEngine';
import back from '../images/back.jpg';

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

function imgUrl([value, suit]: CardType) {
  return require(`../images/${suit.toLowerCase()}/${padStart(`${value}`, 2, '0')}.jpg`).default;
}

const baseCard = {
  height: '13vw',
  width: '7.5vw',
  borderRadius: '0.75vw',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
};

function cardStyle(card: CardType, faceDown?: boolean) {
  return {
    ...baseCard,
    backgroundImage: `url(${faceDown ? back : imgUrl(card)})`,
  };
}
interface CardProps {
  faceDown?: boolean;
  card: CardType;
}

export const Card = ({ faceDown = false, card }: CardProps) => {
  return <Box sx={cardStyle(card, faceDown)} title={faceDown ? 'card' : name(card)} />;
};
