import { range } from 'lodash';

export const SUIT = {
  Denari: 'denari',
  Coppe: 'coppe',
  Bastoni: 'bastoni',
  Spade: 'spade',
} as const;

type Suit = typeof SUIT[keyof typeof SUIT];

export type Card = [number, Suit];

export type Deck = readonly Card[];

export function deck(): Deck {
  const suits = [SUIT.Denari, SUIT.Coppe, SUIT.Bastoni, SUIT.Spade];
  const cards = suits
    .map((suit) => range(1, 11).map<Card>((v) => [v, suit]))
    .flat();

  return cards;
}
