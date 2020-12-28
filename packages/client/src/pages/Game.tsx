/** @jsx jsx */
/** @jsxRuntime classic */
import { useEffect, useMemo, useState } from 'react';
import { Button, Flex, jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, Score, fromCardKey, PlayerActionType, GameAnimation, GameAnimationType } from 'shared';
import { sum } from 'lodash';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';
import { FiRotateCcw } from 'react-icons/fi';
import { Deck } from 'components/Cards/Deck';
import { useRef } from 'react';
import { ReactSpringHook, useChain } from 'react-spring';

// @ts-ignore 
// eslint-disable-next-line
const useCustomAnimations = (gameAnimations: GameAnimation[]) => {
  const dealingCardsRef = useRef<ReactSpringHook>(null);
  const capturingCardsRef = useRef<ReactSpringHook>(null);
  const playingCardRef = useRef<ReactSpringHook>(null);
  const flippingCardsRef = useRef<ReactSpringHook>(null);

  const springAnimations = gameAnimations?.map((animation) => {
    switch (animation.kind) {
      case GameAnimationType.DealCards:
        return dealingCardsRef;
      case GameAnimationType.CaptureCards:
        return capturingCardsRef;
      case GameAnimationType.FlipCards:
        return flippingCardsRef;
      default:
      case GameAnimationType.PlayCard:
        return playingCardRef;
    }
  });

  useChain(springAnimations);
  return {
    dealingCardsRef,
    capturingCardsRef,
    playingCardRef,
    flippingCardsRef,
  };
};

type Props = { gameState: GameState; gameScore?: Score[]; gameAnimations?: GameAnimation[] };

export const Game = ({ gameState, gameScore, gameAnimations }: Props) => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  const { username } = useUserData();
  const { roomName } = useParams<{ roomName: string }>();

  const { activePlayer, deck, table, players } = gameState;

  // TODO figure out what to do when more than 2 players
  const { player, opponent } = useMemo(
    () => Object.fromEntries(players.map((p) => [p.username === username ? 'player' : 'opponent', p])),
    [players, username],
  );
  useEffect(() => {
    if (activePlayerCard && activeCardsOnTable) {
      const { value: playerCardNumber } = fromCardKey(activePlayerCard);
      const tableCardsSum = sum(activeCardsOnTable.map((c) => fromCardKey(c).value));
      if (playerCardNumber === tableCardsSum) {
        gameIO.emit(GameEvent.PlayerAction, roomName, {
          action: PlayerActionType.Capture,
          playerName: player.username,
          card: activePlayerCard,
          tableCards: activeCardsOnTable,
        });
        togglePlayerActiveCard(null);
        toggleActiveCardsOnTable([]);
      }
    }
  }, [activeCardsOnTable, activePlayerCard, player, roomName]);

  const playCardOnTable = () => {
    if (activePlayerCard) {
      console.log('Emit: Card is going to the table');
      gameIO.emit(GameEvent.PlayerAction, roomName, {
        action: PlayerActionType.PlayOnTable,
        playerName: player.username,
        card: activePlayerCard,
      });
      togglePlayerActiveCard(null);
    }
  };

  console.log(gameAnimations);

  const deckLength = deck.length > 0 ? deck.length : 40;
  return (
    <GameTable>
      <Opponent player={opponent} sx={{ transform: 'rotate(180deg)' }} />
      {opponent && <PlayerName playerName={opponent.username} isActive={activePlayer === opponent.username} />}
      <Board
        table={table}
        activeCardsOnTable={activeCardsOnTable}
        movingCards={[]}
        toggleActiveCardsOnTable={toggleActiveCardsOnTable}
        activePlayerCard={activePlayerCard}
        playCardOnTable={playCardOnTable}
      >
        <Deck cardNumber={deckLength} title={`${deckLength} cards left`} />
      </Board>
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
        movingCards={[]}
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
