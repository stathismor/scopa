export const Suit = {
  Golds: 'Golds',
  Cups: 'Cups',
  Clubs: 'Clubs',
  Swords: 'Swords',
} as const;

export type Suit = typeof Suit[keyof typeof Suit];

export type Card = { value: number; suit: Suit };

export type Deck = Card[];

export const cardKey = (card: Card) => `${card.value}__${card.suit}`;

export const fromCardKey = (cardKey: string) => {
  const [num, suit] = cardKey.split('__');
  return { value: Number(num), suit } as Card;
};
