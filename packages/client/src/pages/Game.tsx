/** @jsx jsx */
/** @jsxRuntime classic */
import { useEffect, useMemo, useState } from 'react';
import { jsx } from 'theme-ui';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, GameStatus, Score, Suit, cardKey, fromCardKey, PlayerActionType } from 'shared';
import { sum } from 'lodash';
import { Opponent } from '../components/Players/Opponent';
import { Player } from '../components/Players/Player';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';
import { Board } from 'components/Board';
import { GameScore } from 'components/GameScore';
import { PlayerName } from 'components/Players/PlayerName';

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
};

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
            latestCaptured: username,
          });
          togglePlayerActiveCard(null);
          toggleActiveCardsOnTable([]);
          toggleMovingCards([]);
        }, 600);
      }
    }
    return () => clearTimeout(timer);
  }, [activeCardsOnTable, activePlayerCard, gameState, opponent, player, roomName, username]);

  const playCardOnTable = () => {
    if (activePlayerCard) {
      console.log('Emit: Card is going to the table');
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
        movingCards={movingCards}
        toggleActiveCardsOnTable={toggleActiveCardsOnTable}
        activePlayerCard={activePlayerCard}
        playCardOnTable={playCardOnTable}
      />
      {gameScore && <GameScore gameScore={gameScore} gameState={gameState} />}
      {player && <PlayerName playerName={`You (${player.username})`} isActive={activePlayer === player.username} />}
      <Player
        player={player}
        isActive={activePlayer === player?.username}
        movingCards={movingCards}
        togglePlayerActiveCard={togglePlayerActiveCard}
        activePlayerCard={activePlayerCard}
      />
    </GameTable>
  );
};
