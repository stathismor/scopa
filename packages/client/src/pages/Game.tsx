/** @jsx jsx */
/** @jsxRuntime classic */
import { MouseEvent, useEffect, useState } from 'react';
import { Box, Flex, Text, jsx } from 'theme-ui';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { Card as CardType, deck } from 'utils/cardEngine';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { shuffle, sum } from 'lodash';
import { Suit } from 'shared';
import { cardWrapper, playerCardWrapper } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';

const useCardState = () => {
  const shuffledDeck = shuffle(deck());
  const opponent = shuffledDeck.splice(0, 3);
  const player = shuffledDeck.splice(0, 3);
  const table = shuffledDeck.splice(0, 4);
  const [cardState, setCardState] = useState({
    shuffledDeck,
    opponent,
    player,
    table,
    opponentStack: [] as CardType[],
    playerStack: [] as CardType[],
  });
  return {
    ...cardState,
    setCardState,
  };
};

const cardKey = (card: CardType) => `${card[0]}__${card[1]}`;
const fromCardKey = (cardKey: string): CardType => {
  const [num, suit] = cardKey.split('__');
  return [Number(num), suit as Suit];
};

const fromCardKeys = (cardKeys: string[]): CardType[] => cardKeys.map(fromCardKey);

export const Game = () => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [movingCards, toggleMovingCards] = useState<string[]>([]);
  const { username } = useUserData();

  const { setCardState, shuffledDeck, opponent, player, table, playerStack, opponentStack } = useCardState();

  const playCardOnTable = () => {
    if (activePlayerCard) {
      setCardState((state) => ({
        ...state,
        player: state.player.filter((c) => cardKey(c) !== activePlayerCard),
        table: [...state.table, fromCardKey(activePlayerCard)],
      }));
      togglePlayerActiveCard(null);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activePlayerCard && activeCardsOnTable) {
      const playerCardNumber = fromCardKey(activePlayerCard)[0];
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c)[0]));
      if (playerCardNumber === tableCardsSum) {
        toggleMovingCards([activePlayerCard, ...activeCardsOnTable]);
        timer = setTimeout(() => {
          setCardState((state) => ({
            ...state,
            player: state.player.filter((c) => cardKey(c) !== activePlayerCard),
            table: state.table.filter((c) => !activeCardsOnTable.includes(cardKey(c))),
            playerStack: [...state.playerStack, ...fromCardKeys(activeCardsOnTable), fromCardKey(activePlayerCard)],
          }));
          togglePlayerActiveCard(null);
          toggleActiveCardsOnTable([]);
          toggleMovingCards([]);
        }, 600);
      }
    }
    return () => clearTimeout(timer);
  }, [activePlayerCard, activeCardsOnTable, setCardState]);

  return (
    <GameTable>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginTop: '-7vw' }}>
        <Deck cardNumber={opponentStack.length} />
        {opponent.map((c) => (
          <Card key={cardKey(c)} card={c} faceDown />
        ))}
      </Flex>
      <Text>Opponents</Text>
      <Flex
        sx={{ m: 3, gap: 3, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}
        role="button"
        onClick={playCardOnTable}
      >
        <Deck cardNumber={shuffledDeck.length} title={`${shuffledDeck.length} cards left`} />
        <Box pr={5} />
        {table.map((c) => {
          const key = cardKey(c);
          const isActive = activeCardsOnTable.includes(key);
          const needsToMove = movingCards.includes(key);
          return (
            <CardWrapper
              key={key}
              moving={needsToMove}
              sx={cardWrapper(isActive)}
              onClick={(e: MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                toggleActiveCardsOnTable(
                  isActive ? activeCardsOnTable.filter((c) => c !== key) : [...activeCardsOnTable, key],
                );
              }}
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
      </Flex>
      <Text> You ({username})</Text>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginBottom: '-3vw' }}>
        <Deck cardNumber={playerStack.length} />

        {player.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              moving={movingCards.includes(key)}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={() => togglePlayerActiveCard((state) => (state === key ? null : key))}
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
      </Flex>
    </GameTable>
  );
};
