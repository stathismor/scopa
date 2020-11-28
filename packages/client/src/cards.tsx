import { range } from 'lodash';

export const SUIT = {
  Golds: 'Golds',
  Cups: 'Cups',
  Clubs: 'Clubs',
  Swords: 'Swords',
} as const;

type Suit = typeof SUIT[keyof typeof SUIT];

export type Card = [number, Suit];

export type Deck = readonly Card[];

export function deck(): Deck {
  const suits = [SUIT.Golds, SUIT.Cups, SUIT.Clubs, SUIT.Swords];
  const cards = suits
    .map((suit) => range(1, 11).map<Card>((v) => [v, suit]))
    .flat();

  return cards;
}
