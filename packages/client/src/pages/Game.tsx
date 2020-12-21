/** @jsx jsx */
/** @jsxRuntime classic */
import { useEffect, useMemo, useState } from 'react';
import { Box, Flex, Heading, jsx, Text } from 'theme-ui';
import { Deck } from 'components/Cards/Deck';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, Score } from 'shared';
import { mainDeckPosition } from 'components/Cards/style';
import { sum } from 'lodash';
import { cardKey, fromCardKey } from 'utils/cards';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { Board } from 'components/Board';

export const Game = ({ gameState, gameScore }: { gameState: GameState; gameScore?: Score[] }) => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [movingCards, toggleMovingCards] = useState<string[]>([]);
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();

  const { activePlayer, deck, table, players } = gameState;

  // TODO figure out what to do when more than 2 players
  const [opponent] = useMemo(() => players.filter((player) => player.username !== username), [players, username]);
  const [player] = useMemo(() => players.filter((player) => player.username === username), [players, username]);
  console.log(gameState);
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
      // TODO Might need to add a timeout here to keep the space of the card and avoid flickering
      togglePlayerActiveCard(null);
    }
  };

  console.log({ gameScore });

  return (
    <GameTable>
      <Deck cardNumber={deck.length} title={`${deck.length} cards left`} sx={mainDeckPosition} />
      <Opponent player={opponent} sx={{ transform: 'rotate(180deg)' }} />
      <Board
        table={table}
        activeCardsOnTable={activeCardsOnTable}
        movingCards={movingCards}
        toggleActiveCardsOnTable={toggleActiveCardsOnTable}
        activePlayerCard={activePlayerCard}
        playCardOnTable={playCardOnTable}
      />
      {gameScore && (
        <Flex sx={{ gap: 3 }}>
          {gameScore.map(({ details, total }, i) => (
            <Box key={i}>
              <Heading as="h3" mt={2}>
                {gameState.players[i].username}
              </Heading>
              {details.map(({ label, value }) => (
                <Flex key={label}>
                  <Text mr={1}>{label}:</Text>
                  <Text mr={1}>{value ?? '-'}</Text>
                </Flex>
              ))}
              <Text sx={{ fontWeight: 700 }}>Total: {total}</Text>
            </Box>
          ))}
        </Flex>
      )}
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
