import { range } from 'lodash';
import { Suit } from 'shared';

export type Card = [number, Suit];

export type Deck = readonly Card[];

export function deck(): Deck {
  const suits = [Suit.Golds, Suit.Cups, Suit.Clubs, Suit.Swords];
  const cards = suits
    .map((suit) => range(1, 11).map<Card>((v) => [v, suit]))
    .flat();

  return cards;
}
