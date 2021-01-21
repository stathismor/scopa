import React from 'react';
import { Box } from 'theme-ui';
import { startCase } from 'lodash';

import { Suit, Card as CardType, VALUES } from 'shared';
import back from 'images/back.jpg';
import { baseCard, CARD_HEIGHT_SMALL, CARD_WIDTH_SMALL } from './style';

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

export const SmallCard = ({ faceDown = false, card }: CardProps) => {
  return (
    <Box
      sx={{
        ...baseCard,
        width: CARD_WIDTH_SMALL,
        height: CARD_HEIGHT_SMALL,
        borderRadius: 4,
        backgroundImage: `url(${faceDown ? back : imgUrl(card)})`,
        flexShrink: 0,
      }}
      title={faceDown ? 'card' : name(card)}
    />
  );
};
export const SmallEmptyCard = () => {
  return (
    <Box
      sx={{
        ...baseCard,
        width: CARD_WIDTH_SMALL,
        height: CARD_HEIGHT_SMALL,
        borderRadius: 4,
        boxShadow: 'none',
      }}
    />
  );
};
