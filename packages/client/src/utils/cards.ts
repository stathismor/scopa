import { Card } from 'shared';

export const cardKey = (card: Card) => `${card.value}__${card.suit}`;

export const fromCardKey = (cardKey: string) => {
  const [num, suit] = cardKey.split('__');
  return { value: Number(num), suit } as Card;
};
