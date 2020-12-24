/** @jsx jsx */
/** @jsxRuntime classic */
import { useEffect, useMemo, useState } from 'react';
import { jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameTurnEvent, GameState, GameStatus, Score, Suit } from 'shared';
import { sum } from 'lodash';
import { cardKey, fromCardKey } from 'utils/cards';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';
import { useRef } from 'react';

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
};

const useGameTurn = () => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [movingCards, toggleMovingCards] = useState<string[]>([]);
  useEffect(() => {
    const handleSelectedPlayerCard = (selectedCard: string) => {
      togglePlayerActiveCard(selectedCard);
    };
    const handleSelectedTableCard = (selectedCards: string[]) => {
      toggleActiveCardsOnTable(selectedCards);
    };
    const handleAnimatedCards = (animatingCards: string[]) => {
      console.log(animatingCards);
      toggleMovingCards(animatingCards);
    };
    gameIO.on(GameTurnEvent.SelectedPlayerCard, handleSelectedPlayerCard);
    gameIO.on(GameTurnEvent.SelectedTableCards, handleSelectedTableCard);
    gameIO.on(GameTurnEvent.AnimatedCards, handleAnimatedCards);
    return () => {
      gameIO.off(GameTurnEvent.SelectedPlayerCard, handleSelectedPlayerCard);
      gameIO.off(GameTurnEvent.SelectedTableCards, handleSelectedTableCard);
      gameIO.off(GameTurnEvent.AnimatedCards, handleAnimatedCards);
    };
  }, []);
  return {
    activePlayerCard,
    activeCardsOnTable,
    movingCards,
  };
};

const EMPTY_LIST: string[] = [];
const cleanup = (roomName: string) => {
  gameIO.emit(GameTurnEvent.SelectPlayerCard, roomName, null);
  gameIO.emit(GameTurnEvent.SelectTableCards, roomName, EMPTY_LIST);
  gameIO.emit(GameTurnEvent.AnimateCards, roomName, EMPTY_LIST);
};

export const Game = ({ gameState, gameScore }: { gameState: GameState; gameScore?: Score[] }) => {
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();

  const { activePlayer, deck, table, players } = gameState;
  const timer = useRef<NodeJS.Timeout>();
  // TODO figure out what to do when more than 2 players
  const [opponent] = useMemo(() => players.filter((player) => player.username !== username), [players, username]);
  const [player] = useMemo(() => players.filter((player) => player.username === username), [players, username]);
  const { activePlayerCard, activeCardsOnTable, movingCards } = useGameTurn();
  useEffect(() => {
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum) {
        gameIO.emit(GameTurnEvent.AnimateCards, roomName, [activePlayerCard, ...activeCardsOnTable]);
        timer.current = setTimeout(() => {
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
            latestCaptured: username,
          });
          console.log('cleanup');
          cleanup(roomName);
        }, 600);
      }
    }
    return () => {
      console.log('timeoutCleared');
      clearTimeout(timer.current as NodeJS.Timeout);
    };
  }, [activeCardsOnTable, activePlayerCard, gameState, opponent, player, roomName, username]);

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
      gameIO.emit(GameTurnEvent.SelectPlayerCard, roomName, null);
    }
  };

  console.log(movingCards);
  return (
    <GameTable>
      <Opponent player={opponent} sx={{ transform: 'rotate(180deg)' }} movingCards={movingCards} />
      {opponent && <PlayerName playerName={opponent.username} isActive={activePlayer === opponent.username} />}
      <Board
        table={table}
        deck={gameState.status === GameStatus.Waiting ? [SETTEBELLO] : deck}
        activeCardsOnTable={activeCardsOnTable}
        movingCards={movingCards}
        activePlayerCard={activePlayerCard}
        playCardOnTable={playCardOnTable}
      />
      {gameScore && <GameScore gameScore={gameScore} gameState={gameState} />}
      {player && <PlayerName playerName={`You (${player.username})`} isActive={activePlayer === player.username} />}
      <Player
        player={player}
        isActive={activePlayer === player?.username}
        movingCards={movingCards}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
