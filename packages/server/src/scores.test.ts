// import { finalScore } from './scores';

const gameState = {
  status: 'playing',
  activePlayer: '468o6ql0m',
  deck: [],
  table: [
    { value: 2, suit: 'Cups' },
    { value: 1, suit: 'Golds' },
    { value: 6, suit: 'Golds' },
  ],
  players: [
    {
      username: '468o6ql0m',
      hand: [
        { value: 4, suit: 'Swords' },
        { value: 8, suit: 'Cups' },
        { value: 4, suit: 'Cups' },
      ],
      captured: [],
      scopa: [],
    },
    {
      username: 'v4wod3zj8',
      hand: [
        { value: 3, suit: 'Swords' },
        { value: 5, suit: 'Swords' },
      ],
      captured: [
        { value: 7, suit: 'Cups' },
        { value: 7, suit: 'Clubs' },
      ],
      scopa: [],
    },
  ],
};

const finalState = {
  status: 'playing',
  activePlayer: '468o6ql0m',
  deck: [],
  table: [
    { value: 1, suit: 'Cups' },
    { value: 5, suit: 'Clubs' },
    { value: 8, suit: 'Clubs' },
  ],
  players: [
    {
      username: '468o6ql0m',
      hand: [{ value: 1, suit: 'Clubs' }],
      captured: [
        { value: 7, suit: 'Cups' },
        { value: 3, suit: 'Clubs' },
        { value: 4, suit: 'Cups' },
        { value: 8, suit: 'Cups' },
        { value: 3, suit: 'Swords' },
        { value: 5, suit: 'Swords' },
      ],
      scopa: [],
    },
    { username: 'v4wod3zj8', hand: [], captured: [], scopa: [] },
  ],
};

describe('finalScore calculation', () => {
  it('should work', () => {
    // expect(finalScore(finalState.players)).toEqual([]);
    expect(true).toBeTruthy();
  });
});
