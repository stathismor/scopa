/** @jsx jsx */
/** @jsxRuntime classic */
import { sum } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
};

export const Game = ({
  gameState,
  gameScore,
  playerAction,
}: {
  gameState: GameState;
  gameScore?: Score[];
  playerAction?: PlayerAction;
}) => {
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();
  const [prevState, setPrevState] = useState<GameState>(gameState);
  // const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);

  const togglePlayerActiveCard = (cardKey: string | null) => {
    gameIO.emit(GameEvent.PlayerAction, roomName, {
      action: PlayerActionType.SelectFromHand,
      playerName: player?.username,
      card: cardKey,
    });
  };
  const toggleActiveCardsOnTable = (cardKey: string | null) => {
    gameIO.emit(GameEvent.PlayerAction, roomName, {
      action: PlayerActionType.SelectFromTable,
      playerName: player?.username,
      card: cardKey,
    });
  };

  // useEffect(() => {
  //   if (!playerAction) {
  //     setPrevState(gameState);
  //   }
  // }, [gameState, playerAction]);

  const { activePlayer, deck, table, players, activePlayerCard, activeCardsOnTable } = prevState;

  useEffect(() => {
    switch (playerAction?.action) {
      case PlayerActionType.Capture: {
        const activeCard = getCardElement(playerAction.card);
        const onPlaceComplete = () => {
          animateCapture(activeCard as HTMLDivElement, playerAction.tableCards, playerAction.playerName, {
            onComplete: () => {
              setPrevState(gameState);

              // togglePlayerActiveCard(null);
              // toggleActiveCardsOnTable(null);
            },
          });
        };
        const options = {
          onComplete: onPlaceComplete,
        };
        animatePlace(activeCard, options);
        break;
      }
      case PlayerActionType.PlayOnTable: {
        const activeCard = getCardElement(playerAction.card);
        console.log(activeCard);
        animatePlace(activeCard, {
          onComplete: () => {
            setPrevState(gameState);

            // togglePlayerActiveCard(null);
            // toggleActiveCardsOnTable(null);
          },
        });
        break;
      }
      default:
        setPrevState(gameState);
    }
  }, [playerAction, gameState]);

  // TODO figure out what to do when more than 2 players
  const { player, opponent } = useMemo(
    () => Object.fromEntries(players.map((p) => [p.username === username ? 'player' : 'opponent', p])),
    [players, username],
  );

  useEffect(() => {
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum && playerAction?.action !== PlayerActionType.Capture) {
        gameIO.emit(GameEvent.PlayerAction, roomName, {
          action: PlayerActionType.Capture,
          playerName: player.username,
          card: activePlayerCard,
          tableCards: activeCardsOnTable,
        });
      }
    }
  }, [activeCardsOnTable, activePlayerCard, player, roomName, playerAction]);

  const playCardOnTable = () => {
    if (activePlayerCard && playerAction?.action !== PlayerActionType.PlayOnTable) {
      gameIO.emit(GameEvent.PlayerAction, roomName, {
        action: PlayerActionType.PlayOnTable,
        playerName: player.username,
        card: activePlayerCard,
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
        isActive={activePlayer === player?.username}
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
