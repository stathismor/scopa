/** @jsx jsx */
/** @jsxRuntime classic */

import { PropsWithChildren, MouseEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Text, jsx } from 'theme-ui';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';
import { RoomState, RoomEvent } from 'shared';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { GameEvent, GameState, Card as CardType } from 'shared';

type CardWrapperProps = PropsWithChildren<{ onClick: (e: MouseEvent<HTMLElement>) => void; isActive: boolean }>;
const CardTableWrapper = ({ isActive, ...props }: CardWrapperProps) => (
  <Box
    role="button"
    sx={{
      position: 'relative',
      '&::after': isActive
        ? {
            content: "''",
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            border: '2px solid',
            borderColor: 'primary',
            borderRadius: 1,
          }
        : undefined,
    }}
    {...props}
  />
);

const CardWrapper = (props: CardWrapperProps) => (
  <CardTableWrapper
    sx={{
      transition: 'transform 0.3s ease-in-out',
      transform: props.isActive ? 'translateY(-3.5vw)' : undefined,
      '&:hover': {
        transform: 'translateY(-3.5vw)',
      },
    }}
    {...props}
  />
);

const cardKey = (card: CardType) => `${card[0]}__${card[1]}`;

export const Game = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const [activePlayerCard, togglePlayerActive] = useState<string | null>(null);
  const [activeTableCards, toggleTableActive] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    status: undefined,
    activePlayer: undefined,
    deck: [],
    table: [],
    players: [],
  });
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();

  useEffect(() => {
    const handleSuccess = () => {
      setStatus(RoomState.Joined);
    };

    const handleError = (errorMessage: string) => {
      setStatus(RoomState.Failed);
      setErrorMessage(errorMessage);
    };

    const handleCurrentGameState = (gameState: GameState) => {
      setGameState(gameState);
    };

    gameIO.emit(RoomEvent.Join, roomName, username);

    gameIO.on(RoomEvent.JoinSuccess, handleSuccess);
    gameIO.on(RoomEvent.JoinError, handleError);
    gameIO.on(GameEvent.CurrentState, handleCurrentGameState);

    return () => {
      gameIO.off(RoomEvent.JoinSuccess, handleSuccess);
      gameIO.off(RoomEvent.JoinError, handleError);
    };
  }, [roomName, username]);

  const { activePlayer, deck, table, players } = gameState;

  const playCardOnTable = () => {
    console.log('Need to emit update to server here');
  };

  const opponent = players.filter((player) => player.username !== activePlayer)[0];
  const opponentCaptured = opponent?.captured || [];
  const opponentHand = opponent?.hand || [];

  const player = players.filter((player) => player.username === activePlayer)[0];
  const playerCaptured = player?.captured || [];
  const playerHand = player?.hand || [];

  switch (status) {
    case RoomState.Pending:
      return <div>Pending</div>;
    case RoomState.Joined:
      return (
        <Layout>
          <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
            <Link to="/">Back</Link>
          </Box>

          <GameTable>
            <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginTop: '-7vw' }}>
              <Deck cardNumber={opponentCaptured.length} />
              {opponentHand.map((c) => (
                <Card key={cardKey(c)} card={c} faceDown />
              ))}
            </Flex>
            <Text>Opponents</Text>
            <Flex
              sx={{ m: 3, gap: 3, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}
              role="button"
              onClick={playCardOnTable}
            >
              <Deck cardNumber={deck.length} title={`${deck.length} cards left`} />
              <Box pr={5} />
              {table.map((c) => {
                const key = cardKey(c);
                const isActive = activeTableCards?.includes(key);
                return (
                  <CardTableWrapper
                    key={key}
                    isActive={isActive}
                    onClick={(e: MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      toggleTableActive(
                        isActive ? activeTableCards.filter((c) => c !== key) : [...activeTableCards, key],
                      );
                    }}
                  >
                    <Card card={c} />
                  </CardTableWrapper>
                );
              })}
            </Flex>
            <Text> You ({activePlayer})</Text>
            <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginBottom: '-3vw' }}>
              <Deck cardNumber={playerCaptured.length} />

              {playerHand.map((c) => {
                const key = cardKey(c);
                return (
                  <CardWrapper
                    key={key}
                    isActive={activePlayerCard === key}
                    onClick={() => togglePlayerActive((state) => (state === key ? null : key))}
                  >
                    <Card card={c} />
                  </CardWrapper>
                );
              })}
            </Flex>
          </GameTable>
        </Layout>
      );
    default:
    case RoomState.Failed:
      return <div>Error: {errorMessage}</div>;
  }
};
