/** @jsx jsx */
/** @jsxRuntime classic */
import { MouseEvent, useEffect, useState } from 'react';
import { Box, Flex, jsx } from 'theme-ui';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameState } from 'shared';
import { cardWrapper } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { sum } from 'lodash';
import { cardKey, fromCardKey } from 'utils/cards';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';

export const Game = ({ gameState }: { gameState: GameState }) => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [movingCards, toggleMovingCards] = useState<string[]>([]);
  const { username } = useUserData();

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

  // TODO figure out what to do when more than 2 players
  const [opponent] = players.filter((player) => player.username !== username);
  const [player] = players.filter((player) => player.username === username);
  return (
    <GameTable>
      <Opponent player={opponent} sx={{ transform: 'rotate(180deg)' }} />
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
      <Player
        player={player}
        activePlayer={activePlayer}
        movingCards={movingCards}
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
