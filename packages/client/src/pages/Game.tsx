/** @jsx jsx */
/** @jsxRuntime classic */
import { useEffect, useMemo, useState } from 'react';
import { Button, Flex, jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, Score, fromCardKey, PlayerActionType, PlayerAction } from 'shared';
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
import { MOVE_TO } from 'components/Players/constants';
// import { useRef } from 'react';
// import { ReactSpringHook } from 'react-spring';

// @ts-ignore
// eslint-disable-next-line
// const useStateMachine = (player: PlayerState, opponent: PlayerState, latestAction?: PlayerAction) => {
//   const capturingCardsRef = useRef<ReactSpringHook>(null);
//   const playingCardRef = useRef<ReactSpringHook>(null);
//   const [playerAnimations, setPlayerAnimations] = useState({
//     player: null,
//     opponent: null,
//   });
//   switch (latestAction?.action) {
//     case PlayerActionType.PlayOnTable:
//       return playingCardRef;
//     case PlayerActionType.Capture:
//       return capturingCardsRef;
//     default:
//       return;
//   }
// };

type Props = { gameState: GameState; gameScore?: Score[]; latestAction?: PlayerAction };

export const Game = ({ gameState, gameScore, latestAction }: Props) => {
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

  const playerAction = useMemo(() => (latestAction ? { [latestAction?.playerName]: latestAction } : {}), [
    latestAction,
  ]);

  const deckLength = deck.length > 0 ? deck.length : 40;
  return (
    <GameTable>
      <Opponent player={opponent} sx={{ transform: 'rotate(180deg)' }} action={playerAction[opponent?.username]} />
      {opponent && <PlayerName playerName={opponent.username} isActive={activePlayer === opponent.username} />}
      <Board
        table={table}
        activeCardsOnTable={activeCardsOnTable}
        movingCards={latestAction?.tableCards}
        moveTo={MOVE_TO[latestAction?.playerName === player?.username ? 'player' : 'opponent']}
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
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
        action={playerAction[player?.username]}
      />
    </GameTable>
  );
};
