/** @jsx jsx */
/** @jsxRuntime classic */
import { useRef } from 'react';
import { sum } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiRotateCcw } from 'react-icons/fi';
import { gameIO } from 'lib/socket';
import { Button, Flex, jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, GameStatus, Score, Suit, fromCardKey, PlayerActionType } from 'shared';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';
import { animatePlace, animateCapture } from 'lib/animation/cardAnimations';
import { getCardElement } from 'utils/dom';

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
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
     * This needs to update only when gameState changes
     */
    // eslint-disable-next-line
  }, [gameState]);

  // TODO figure out what to do when more than 2 players
  const isSpectator = !players.some((player) => player.username === username);
  const { player, opponent } = useMemo(
    () =>
      Object.fromEntries(
        players.map((p) => [
          p.username === username || (isSpectator && p.username === activePlayer) ? 'player' : 'opponent',
          p,
        ]),
      ),
    [players, activePlayer, isSpectator, username],
  );

  useEffect(() => {
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum && prevCard.current !== activePlayerCard) {
        const activeCard = getCardElement(activePlayerCard);
        const onPlaceComplete = () => {
          animateCapture(activeCard as HTMLDivElement, activeCardsOnTable, {
            onComplete: () => {
              gameIO.emit(GameEvent.PlayerAction, roomName, {
                action: PlayerActionType.Capture,
                playerName: player.username,
                card: activePlayerCard,
                tableCards: activeCardsOnTable,
              });
            },
          });
        };
        const options = {
          onComplete: onPlaceComplete,
        };
        animatePlace(activeCard, options);
      }
    }
  }, [activeCardsOnTable, activePlayerCard, player, roomName]);

  const playCardOnTable = () => {
    const activeCard = getCardElement(activePlayerCard);
    if (activePlayerCard) {
      animatePlace(activeCard, {
        onComplete: () => {
          gameIO.emit(GameEvent.PlayerAction, roomName, {
            action: PlayerActionType.PlayOnTable,
            playerName: player.username,
            card: activePlayerCard,
          });
        },
      });
    }
  };

  const isActive = !isSpectator && activePlayer === player?.username;

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
            disabled={isSpectator}
            onClick={() => {
              gameIO.emit(GameEvent.PlayerAction, roomName, {
                action: PlayerActionType.Undo,
                playerName: player.username,
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
        isActive={isActive}
        isSpectator={isSpectator}
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
