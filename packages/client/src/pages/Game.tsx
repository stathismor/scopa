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
import { GameEvent, GameState, GameStatus, Score, Suit, fromCardKey, PlayerActionType, PlayerAction } from 'shared';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';
import { animatePlace, animateCapture } from 'lib/animation/cardAnimations';
import { getCardElement } from 'utils/dom';
import { useCallback } from 'react';

function useStateCallback(initialState: any) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<Function | null>(null); // mutable ref to store current callback

  const setStateCallback = useCallback((state: any, cb: Function) => {
    cbRef.current = cb; // store passed callback to ref
    setState(state);
  }, []);

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (typeof cbRef.current == 'function') {
      cbRef.current?.(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

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
  latestCaptured: '',
  activePlayerCard: null,
  activeCardsOnTable: [],
};

export const Game = () => {
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();
  const [activePlayerCard, togglePlayerActiveCard] = useStateCallback(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [gameScore, setGameScore] = useState<Score[]>();
  const activePlayerCardRef = useRef<string | null>(null);
  const playerActionRef = useRef<string | null>(null);

  useEffect(() => {
    togglePlayerActiveCard(null);
    toggleActiveCardsOnTable([]);
    activePlayerCardRef.current = null;
    playerActionRef.current = null;
  }, [gameState, togglePlayerActiveCard]);

  const { activePlayer, deck, table, players } = gameState;

  useEffect(() => {
    const handleCurrentGameState = (state: GameState, playerAction?: PlayerAction) => {
      debugger;
      playerActionRef.current = playerAction?.action ?? null;
      switch (playerAction?.action) {
        case PlayerActionType.Capture: {
          const cb = () => {
            const activeCard = getCardElement(playerAction.card) as HTMLDivElement;
            const capturedCards = playerAction.tableCards.map((cardKey) => getCardElement(cardKey)) as HTMLDivElement[];
            console.log(activeCard, capturedCards);
            if (activeCard) {
              const onPlaceComplete = () => {
                animateCapture([activeCard, ...capturedCards], playerAction.playerName, {
                  onComplete: () => {
                    setGameState(state);
                  },
                });
              };
              const options = {
                onComplete: onPlaceComplete,
              };
              animatePlace(activeCard, options);
            }
          };
          if (!activePlayerCardRef.current) {
            togglePlayerActiveCard(playerAction.card, cb);
          } else {
            cb();
          }

          break;
        }
        case PlayerActionType.PlayOnTable: {
          const cb = () => {
            const activeCard = getCardElement(playerAction.card);
            if (activeCard) {
              console.count('PlayOnTable');
              animatePlace(activeCard, {
                onComplete: () => {
                  setGameState(state);
                },
              });
            } else {
              console.log('Why is this happening');
            }
          };
          if (!activePlayerCardRef.current) {
            togglePlayerActiveCard(playerAction.card, cb);
          } else {
            cb();
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

  useEffect(() => {
    const handleGameEnded = (score: Score[]) => {
      setGameScore(score);
    };
    gameIO.on(GameStatus.Ended, handleGameEnded);
    return () => {
      gameIO.off(GameStatus.Ended, handleGameEnded);
    };
  }, []);

  // TODO figure out what to do when more than 2 players
  const { player, opponent } = useMemo(
    () => Object.fromEntries(players.map((p) => [p.username === username ? 'player' : 'opponent', p])),
    [players, username],
  );

  const isActivePlayer = activePlayer === player?.username;

  useEffect(() => {
    if (isActivePlayer && activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum) {
        gameIO.emit(GameEvent.PlayerAction, roomName, {
          action: PlayerActionType.Capture,
          playerName: player.username,
          card: activePlayerCard,
          tableCards: activeCardsOnTable,
        });
      }
    }
  }, [activeCardsOnTable, activePlayerCard, player, roomName, isActivePlayer]);

  const playCardOnTable = () => {
    if (isActivePlayer && activePlayerCard) {
      gameIO.emit(GameEvent.PlayerAction, roomName, {
        action: PlayerActionType.PlayOnTable,
        playerName: player.username,
        card: activePlayerCard,
      });
    }
  };

  return (
    <GameTable>
      <Opponent player={opponent} />
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
          <PlayerName playerName={`You (${player.username})`} isActive={isActivePlayer} />
          <Button
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
        isActive={isActivePlayer}
        togglePlayerActiveCard={(activeCard) => {
          activePlayerCardRef.current = activeCard;
          togglePlayerActiveCard(activeCard);
        }}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
