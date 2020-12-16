import { shuffle, range } from 'lodash';

import { GameState, PlayerState, Suit, Card, GameStatus, Deck } from 'shared';

export function generateRoomName(): string {
  return Math.random().toString(36).substring(4);
}

export function generateUsername(): string {
  return Math.random().toString(36).substring(4);
}

export function generateDeck(): Deck {
  const suits = [Suit.Golds, Suit.Cups, Suit.Clubs, Suit.Swords];

  return suits
    .map((suit) => range(1, 11).map<Card>((value) => ({ value, suit })))
    .flat();
}

export function generateGameState(usernames: string[]): GameState {
  const activePlayer = usernames[Math.floor(Math.random() * usernames.length)];
  const deck = shuffle(generateDeck());
  const players = usernames.map((username) => {
    const hand = deck.splice(0, 3);
    return generatePlayerState(username, hand);
  });
  const table = deck.splice(0, 4);

  return { status: GameStatus.Playing, activePlayer, deck: generateDeck(), table, players };
}

function generatePlayerState(username: string, hand: Deck): PlayerState {
  return {
    username,
    hand,
    captured: [],
    scopa: [],
  };
}
