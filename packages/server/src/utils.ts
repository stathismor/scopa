import { shuffle, range } from 'lodash';
import { PlayerState, GameState, Suit, Card, GameStatus, Deck } from 'shared';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export function generateUniqueName(): string {
  return uniqueNamesGenerator(customConfig);
}

export function generateDeck(): Deck {
  const suits = [Suit.Golds, Suit.Cups, Suit.Clubs, Suit.Swords];

  return suits
    .map((suit) => range(1, 11).map<Card>((value) => ({ value, suit })))
    .flat();
}

export function generateGameState(usernames: string[], activePlayer: string, totalScores?: number[]): GameState {
  const deck = shuffle(generateDeck());
  const players = usernames.map((username, i) => {
    const hand = deck.splice(0, 3);
    return generatePlayerState(username, hand, totalScores?.[i] ?? 0);
  });
  const table = deck.splice(0, 4);

  return {
    status: GameStatus.Playing,
    activePlayer,
    deck,
    table,
    players,
    round: 0,
    turn: 0,
    latestCaptured: '',
  };
}

function generatePlayerState(username: string, hand: Deck, total: number): PlayerState {
  return {
    username,
    hand,
    captured: [],
    scopa: [],
    score: {
      total,
      totalRound: 0,
      details: [],
      isWinning: false,
    },
  };
}
