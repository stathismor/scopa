import { words } from 'lodash';

export const Suit = {
  Golds: 'Golds',
  Cups: 'Cups',
  Clubs: 'Clubs',
  Swords: 'Swords',
} as const;

export const VALUES: { [key: number]: string } = {
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

export type SuitType = typeof Suit[keyof typeof Suit];

export type Card = { value: number; suit: SuitType };

export type Deck = Card[];

export const cardKey = (card: Card) => `${card.value}__${card.suit}`;

export const fromCardKey = (cardKey: string) => {
  const [num, suit] = cardKey.split('__');
  return { value: Number(num), suit } as Card;
};

export const getCardName = (cardKey: string) => {
  const [value, suit] = words(cardKey);
  return `${value} of ${suit}`;
};
