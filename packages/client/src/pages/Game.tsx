/** @jsx jsx */
/** @jsxRuntime classic */
import { sum } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiRotateCcw } from 'react-icons/fi';
import { gameIO } from 'lib/socket';
import { Button, Flex, jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, GameStatus, Suit, fromCardKey, PlayerActionType, PlayerAction } from 'shared';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';
import { animatePlace, animateCapture } from 'lib/animation/cardAnimations';
import { getCardElement } from 'utils/dom';
import { useStateCallback } from 'hooks/useStateCallback';

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
};

const INITIAL_STATE = {
  status: GameStatus.Waiting,
  activePlayer: '',
  deck: [],
  table: [],
  players: [],
  round: 0,
  turn: 0,
  latestCaptured: '',
  activePlayerCard: null,
  activeCardsOnTable: [],
};

export const Game = () => {
  const { username } = useUserData();
  const { roomId } = useParams<{ roomId: string }>();
  const [activePlayerCard, togglePlayerActiveCard] = useStateCallback(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  /**
   * Need to keep track of the active player card for the opponent animation
   * we are using a ref to avoid having a dependency on this state in the effect
   * where we set the socket connection
   */
  const activePlayerCardRef = useRef<string | null>(null);
  const { activePlayer, deck, table, players } = gameState;

  useEffect(() => {
    const localStateCleanup = () => {
      togglePlayerActiveCard(null);
      toggleActiveCardsOnTable([]);
      activePlayerCardRef.current = null;
    };
    const handleCurrentGameState = (state: GameState, playerAction?: PlayerAction) => {
      switch (playerAction?.action) {
        case PlayerActionType.Capture: {
          const animateCallback = () => {
            const activeCard = getCardElement(playerAction.card) as HTMLDivElement;
            const capturedCards = playerAction.tableCards.map((cardKey) => getCardElement(cardKey)) as HTMLDivElement[];
            const onPlaceComplete = () => {
              animateCapture([activeCard, ...capturedCards], playerAction.playerName, {
                delay: 0.3,
                onComplete: () => {
                  setGameState(state);
                  localStateCleanup();
                },
              });
            };
            const options = {
              onComplete: onPlaceComplete,
            };
            animatePlace(activeCard, options);
          };
          if (!activePlayerCardRef.current) {
            togglePlayerActiveCard(playerAction.card, animateCallback);
          } else {
            animateCallback();
          }

          break;
        }
        case PlayerActionType.PlayOnTable: {
          const animateCallback = () => {
            const activeCard = getCardElement(playerAction.card);
            animatePlace(activeCard, {
              onComplete: () => {
                setGameState(state);
                localStateCleanup();
              },
            });
          };
          if (!activePlayerCardRef.current) {
            togglePlayerActiveCard(playerAction.card, animateCallback);
          } else {
            animateCallback();
          }
          break;
        }
        default:
          setGameState(state);
      }
    };

    gameIO.on(GameEvent.CurrentState, handleCurrentGameState);

    return () => {
      gameIO.off(GameEvent.CurrentState, handleCurrentGameState);
    };
  }, [togglePlayerActiveCard]);

  const isSpectator = players.length > 0 && !players.some((player) => player.username === username);
  const { player, opponent } = useMemo(() => {
    if (isSpectator) {
      return {
        player: players[0],
        opponent: players[1],
      };
    } else {
      return Object.fromEntries(players.map((p) => [p.username === username ? 'player' : 'opponent', p]));
    }
  }, [players, isSpectator, username]);

  const isActivePlayer = !isSpectator && activePlayer === player?.username;

  useEffect(() => {
    if (isActivePlayer && activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum) {
        gameIO.emit(GameEvent.PlayerAction, roomId, {
          action: PlayerActionType.Capture,
          playerName: player.username,
          card: activePlayerCard,
          tableCards: activeCardsOnTable,
        });
      }
    }
  }, [activeCardsOnTable, activePlayerCard, player, roomId, isActivePlayer]);

  const playCardOnTable = () => {
    if (isActivePlayer && activePlayerCard) {
      gameIO.emit(GameEvent.PlayerAction, roomId, {
        action: PlayerActionType.PlayOnTable,
        playerName: player.username,
        card: activePlayerCard,
      });
    }
  };
  return (
    <GameTable>
      <Opponent player={opponent} activePlayerCard={activePlayerCard} />
      {opponent && <PlayerName player={opponent} isActive={activePlayer === opponent.username} />}
      <Flex sx={{ flex: 1, alignItems: 'center', width: '100%' }}>
        {gameState.status === GameStatus.Ended || gameState.status === GameStatus.RoundEnded ? (
          <GameScore players={gameState.players} gameStatus={gameState.status} />
        ) : (
          <Board
            table={table}
            deck={gameState.status === GameStatus.Waiting ? [SETTEBELLO] : deck}
            activeCardsOnTable={activeCardsOnTable}
            toggleActiveCardsOnTable={toggleActiveCardsOnTable}
            activePlayerCard={activePlayerCard}
            playCardOnTable={playCardOnTable}
          />
        )}
      </Flex>
      {player && (
        <Flex>
          <PlayerName player={player} isActive={isActivePlayer} />
          <Button
            disabled={isSpectator}
            onClick={() => {
              gameIO.emit(GameEvent.PlayerAction, roomId, {
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
        isActive={isActivePlayer}
        isSpectator={isSpectator}
        togglePlayerActiveCard={(activeCard) => {
          activePlayerCardRef.current = activeCard;
          togglePlayerActiveCard(activeCard);
        }}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
