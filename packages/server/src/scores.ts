import { some, groupBy, orderBy, mapValues, first, sumBy } from 'lodash';
import { Card, PlayerState, Suit, Score } from 'shared';

const SETTEBELLO = { value: 7, suit: Suit.Golds };

const PrimePoints: { [value: number]: number } = {
  1: 16,
  2: 12,
  3: 13,
  4: 14,
  5: 15,
  6: 18,
  7: 21,
  8: 10,
  9: 10,
  10: 10,
};

const primeCards = (captured: Card[]): Card[] => {
  return Object.values(
    mapValues(
      groupBy(captured, 'suit'),
      (cards) => first(orderBy(cards, (card) => PrimePoints[card.value], ['desc'])) as Card,
    ),
  );
};

const primeScore = (primeCards: Card[]) => sumBy(primeCards, (card) => PrimePoints[card.value]);

function findWinner(totals: number[]): number | null {
  const maximum = Math.max(...totals);
  const singleWinner = totals.filter((total) => total === maximum).length === 1;
  return singleWinner ? totals.indexOf(maximum) : null;
}

export function finalScore(players: readonly PlayerState[]): readonly Score[] {
  const cardTotal = players.map(({ captured }) => captured.length);
  const mostCards = findWinner(cardTotal);

  const goldsTotal = players.map(({ captured }) => captured.filter(({ suit }) => suit === Suit.Golds).length);
  const mostGolds = findWinner(goldsTotal);

  const primes = players.map(({ captured }) => {
    const cards = primeCards(captured);
    return {
      score: primeScore(cards),
      cards,
    };
  });
  const highestPrime = findWinner(primes.map(({ score }) => score));

  return players.map(({ scopa, captured, username }, playerIndex) => {
    const settebello = some(captured, SETTEBELLO);
    const goldsCards = captured.filter(({ suit }) => suit === Suit.Golds);
    const scope = scopa.length;
    const settebelloPoint = settebello ? 1 : 0;
    const primePoint = highestPrime === playerIndex ? 1 : 0;
    return {
      username,
      details: [
        { label: 'Scopa', value: scope, cards: scopa },
        { label: 'Captured', value: captured.length, cards: captured },
        { label: 'Golds', value: goldsTotal[playerIndex], cards: goldsCards },
        { label: 'Sette Bello', value: settebelloPoint, cards: settebello ? [SETTEBELLO] : [] },
        { label: 'Primiera', value: primePoint, ...primes[playerIndex] },
      ],
      total:
        scope +
        settebelloPoint +
        (mostCards === playerIndex ? 1 : 0) +
        (mostGolds === playerIndex ? 1 : 0) +
        primePoint,
    };
  });
}
