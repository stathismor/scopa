/** @jsx jsx */
/** @jsxRuntime classic */
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { Box, Flex, jsx } from 'theme-ui';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState } from 'shared';
import { cardWrapper } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { sum } from 'lodash';
import { cardKey, fromCardKey } from 'utils/cards';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';

export const Game = ({ gameState }: { gameState: GameState }) => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [movingCards, toggleMovingCards] = useState<string[]>([]);
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();

  const { activePlayer, deck, table, players } = gameState;

  // TODO figure out what to do when more than 2 players
  const [opponent] = useMemo(() => players.filter((player) => player.username !== username), [players, username]);
  const [player] = useMemo(() => players.filter((player) => player.username === username), [players, username]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum) {
        toggleMovingCards([activePlayerCard, ...activeCardsOnTable]);
        timer = setTimeout(() => {
          console.log('Emit: Cards are going to playerCaptured');
          gameIO.emit(GameEvent.UpdateState, roomName, {
            ...gameState,
            activePlayer: opponent.username,
            players: [
              opponent,
              {
                ...player,
                hand: player.hand.filter((c) => cardKey(c) !== activePlayerCard),
                captured: [
                  ...player.captured,
                  fromCardKey(activePlayerCard),
                  ...activeCardsOnTable.map((c) => fromCardKey(c)),
                ],
              },
            ],
            table: gameState.table.filter((c) => !activeCardsOnTable.includes(cardKey(c))),
          });
          togglePlayerActiveCard(null);
          toggleActiveCardsOnTable([]);
          toggleMovingCards([]);
        }, 600);
      }
    }
    return () => clearTimeout(timer);
  }, [activeCardsOnTable, activePlayerCard, gameState, opponent, player, roomName]);

  const playCardOnTable = () => {
    if (activePlayerCard) {
      console.log('Emit: Card is going to the table');
      gameIO.emit(GameEvent.UpdateState, roomName, {
        ...gameState,
        activePlayer: opponent.username,
        players: [
          opponent,
          {
            ...player,
            hand: player.hand.filter((c) => cardKey(c) !== activePlayerCard),
          },
        ],
        table: [...gameState.table, fromCardKey(activePlayerCard)],
      });
      togglePlayerActiveCard(null);
    }
  };

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
