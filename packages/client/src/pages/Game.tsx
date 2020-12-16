/** @jsx jsx */
/** @jsxRuntime classic */
import { MouseEvent, useEffect, useState } from 'react';
import { Box, Flex, Text, jsx } from 'theme-ui';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { gameIO } from 'lib/socket';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, Card as CardType } from 'shared';
import { cardWrapper, playerCardWrapper } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { sum } from 'lodash';

const cardKey = (card: CardType) => `${card.value}__${card.suit}`;
const fromCardKey = (cardKey: string) => {
  const [num, suit] = cardKey.split('__');
  return { value: Number(num), suit } as CardType;
};

export const Game = () => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [movingCards, toggleMovingCards] = useState<string[]>([]);
  const { username } = useUserData();
  const [gameState, setGameState] = useState<GameState>({
    status: undefined,
    activePlayer: undefined,
    deck: [],
    table: [],
    players: [],
  });

  useEffect(() => {
    const handleCurrentGameState = (gameState: GameState) => {
      setGameState(gameState);
    };

    gameIO.on(GameEvent.CurrentState, handleCurrentGameState);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum) {
        toggleMovingCards([activePlayerCard, ...activeCardsOnTable]);
        timer = setTimeout(() => {
          console.log('Need to emit an event: Cards are going to playerCaptured');
          togglePlayerActiveCard(null);
          toggleActiveCardsOnTable([]);
          toggleMovingCards([]);
        }, 600);
      }
    }
    return () => clearTimeout(timer);
  }, [activeCardsOnTable, activePlayerCard]);

  const { activePlayer, deck, table, players } = gameState;

  const playCardOnTable = () => {
    if (activePlayerCard) {
      console.log('Need to emit: Card is going to the table');
      togglePlayerActiveCard(null);
    }
  };

  const opponent = players.filter((player) => player.username !== activePlayer)[0];
  const opponentCaptured = opponent?.captured || [];
  const opponentHand = opponent?.hand || [];

  const player = players.filter((player) => player.username === activePlayer)[0];
  const playerCaptured = player?.captured || [];
  const playerHand = player?.hand || [];

  return (
    <GameTable>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginTop: '-7vw' }}>
        <Deck cardNumber={opponentCaptured.length} />
        {opponentHand.map((c) => (
          <Card key={cardKey(c)} card={c} faceDown />
        ))}
      </Flex>
      <Text>Opponents</Text>
      <Flex
        sx={{ m: 3, gap: 3, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}
        role="button"
        onClick={playCardOnTable}
      >
        <Deck cardNumber={deck.length} title={`${deck.length} cards left`} />
        <Box pr={5} />
        {table.map((c) => {
          const key = cardKey(c);
          const isActive = activeCardsOnTable.includes(key);
          const needsToMove = movingCards.includes(key);
          return (
            <CardWrapper
              key={key}
              isMoving={needsToMove}
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
        <Deck cardNumber={playerCaptured.length} />

        {playerHand.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              isMoving={movingCards.includes(key)}
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
