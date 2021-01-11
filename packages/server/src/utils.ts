import { shuffle, range, sample } from 'lodash';
import { GameState, PlayerState, Suit, Card, GameStatus, Deck } from 'shared';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import { ROOM_PREFIX } from './database/schema';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export function generateRoomName(): string {
  return `${ROOM_PREFIX}-${Math.random().toString(36).substring(4)}`;
}

export function generateUsername(): string {
  return uniqueNamesGenerator(customConfig);
}

export function generateDeck(): Deck {
  const suits = [Suit.Golds, Suit.Cups, Suit.Clubs, Suit.Swords];

  return suits
    .map((suit) => range(1, 11).map<Card>((value) => ({ value, suit })))
    .flat();
}

export function generateGameState(usernames: string[]): GameState {
  const activePlayer = sample(usernames) as string;
  const deck = shuffle(generateDeck());
  const players = usernames.map((username) => {
    const hand = deck.splice(0, 3);
    return generatePlayerState(username, hand);
  });
  const table = deck.splice(0, 4);

  return {
    status: GameStatus.Playing,
    activePlayer,
    deck,
    table,
    players,
    latestCaptured: '',
  };
}

function generatePlayerState(username: string, hand: Deck): PlayerState {
  return {
    username,
    hand,
    captured: [],
    scopa: [],
  };
}
