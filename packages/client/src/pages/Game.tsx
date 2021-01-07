/** @jsx jsx */
/** @jsxRuntime classic */
import { useEffect, useMemo, useState } from 'react';
import { Button, Flex, jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, GameStatus, Score, Suit, fromCardKey, PlayerActionType } from 'shared';
import { sum } from 'lodash';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';
import { FiRotateCcw } from 'react-icons/fi';
import { flip, FlipOptions } from 'utils/animations';
import { useRef } from 'react';

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
};

const animateCardOnTable = (activePlayerCard: string, options: FlipOptions = {}) => {
  const cardWrap = document.querySelector(`#card_${activePlayerCard}`)?.firstChild;
  const dropElement = document.querySelector('#drop-container');
  console.log('Emit: Card is going to the table');
  function moveCard() {
    dropElement?.removeChild(dropElement.firstChild!);
    dropElement?.appendChild(cardWrap!);
  }
  flip([cardWrap], moveCard, options);
  return cardWrap;
};
const animateCapture = (animatedCard: HTMLDivElement, caputeredCards: string[], options: FlipOptions = {}) => {
  const cardWraps = caputeredCards
    .map((cardKey) => document.querySelector(`#card_${cardKey}`)?.firstChild)
    .concat([animatedCard]) as HTMLDivElement[];
  const dropElement = document.querySelector(`#player-deck`);
  function moveCards() {
    cardWraps.forEach((el: HTMLDivElement) => {
      el.style.position = 'absolute';
      el.style.top = '0';
      dropElement?.appendChild(el);
    });
  }
  flip(cardWraps, moveCards, {
    ...options,
    onComplete: () => {
      options?.onComplete?.();
      cardWraps.forEach((el) => {
        dropElement?.removeChild(el);
      });
    },
  });
};

export const Game = ({ gameState, gameScore }: { gameState: GameState; gameScore?: Score[] }) => {
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();
  const { activePlayer, deck, table, players } = gameState;
  const prevCard = useRef<string | null>(null);
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);

  useEffect(() => {
    togglePlayerActiveCard(null);
    toggleActiveCardsOnTable([]);
    prevCard.current = activePlayerCard;
    /**
     * This needs to update only when gamestate change
     */
    // eslint-disable-next-line
  }, [gameState]);

  // TODO figure out what to do when more than 2 players
  const { player, opponent } = useMemo(
    () => Object.fromEntries(players.map((p) => [p.username === username ? 'player' : 'opponent', p])),
    [players, username],
  );

  useEffect(() => {
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum && prevCard.current !== activePlayerCard) {
        const options = {
          onComplete: runNext,
        };
        const animatedCard = animateCardOnTable(activePlayerCard, options);
        function runNext() {
          animateCapture(animatedCard as HTMLDivElement, activeCardsOnTable, {
            onComplete: () => {
              gameIO.emit(GameEvent.PlayerAction, roomName, {
                action: PlayerActionType.Capture,
                playerName: player.username,
                card: activePlayerCard,
                tableCards: activeCardsOnTable,
              });
            },
          });
        }
      }
    }
  }, [activeCardsOnTable, activePlayerCard, player, roomName]);

  const playCardOnTable = () => {
    if (activePlayerCard) {
      animateCardOnTable(activePlayerCard, {
        onComplete: () => {
          console.log('tx complete', activePlayerCard);
          gameIO.emit(GameEvent.PlayerAction, roomName, {
            action: PlayerActionType.PlayOnTable,
            playerName: player.username,
            card: activePlayerCard,
          });
        },
      });
    }
  };
  return (
    <GameTable>
      <Opponent player={opponent} sx={{ transform: 'rotate(180deg)' }} />
      {opponent && <PlayerName playerName={opponent.username} isActive={activePlayer === opponent.username} />}
      <Board
        table={table}
        deck={gameState.status === GameStatus.Waiting ? [SETTEBELLO] : deck}
        activeCardsOnTable={activeCardsOnTable}
        toggleActiveCardsOnTable={toggleActiveCardsOnTable}
        activePlayerCard={activePlayerCard}
        playCardOnTable={playCardOnTable}
      />
      {gameScore && <GameScore gameScore={gameScore} gameState={gameState} />}
      {player && (
        <Flex>
          <PlayerName playerName={`You (${player.username})`} isActive={activePlayer === player.username} />
          <Button
            onClick={() => {
              gameIO.emit(GameEvent.PlayerAction, roomName, {
                action: PlayerActionType.Undo,
              });
            }}
            sx={{ ml: 2, lineHeight: 0 }}
          >
            <FiRotateCcw />
          </Button>
        </Flex>
      )}

      <Player
        player={player}
        isActive={activePlayer === player?.username}
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
