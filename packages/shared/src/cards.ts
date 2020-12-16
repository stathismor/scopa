export const Suit = {
  Golds: 'Golds',
  Cups: 'Cups',
  Clubs: 'Clubs',
  Swords: 'Swords',
} as const;

export type Suit = typeof Suit[keyof typeof Suit];

export type Card = { value: number; suit: Suit };

export type Deck = Card[];
