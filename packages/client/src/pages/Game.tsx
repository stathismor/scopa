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
import { Card as CardType, deck } from 'utils/cardEngine';
import { useUserData } from 'components/UserContext';
import { GameTable } from 'components/GameTable';
import { shuffle, sum } from 'lodash';
import { Suit } from 'shared';

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

const useCardState = () => {
  const shuffledDeck = shuffle(deck());
  const opponent = shuffledDeck.splice(0, 3);
  const player = shuffledDeck.splice(0, 3);
  const table = shuffledDeck.splice(0, 4);
  const [cardState, setCardState] = useState({
    shuffledDeck,
    opponent,
    player,
    table,
    opponentStack: [] as CardType[],
    playerStack: [] as CardType[],
  });
  return {
    ...cardState,
    setCardState,
  };
};

const cardKey = (card: CardType) => `${card[0]}__${card[1]}`;
const fromCardKey = (cardKey: string): CardType => {
  const [num, suit] = cardKey.split('__');
  return [Number(num), suit as Suit];
};

const fromCardKeys = (cardKeys: string[]): CardType[] => cardKeys.map(fromCardKey);

export const Game = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const [activePlayerCard, togglePlayerActive] = useState<string | null>(null);
  const [activeTableCards, toggleTableActive] = useState<string[]>([]);
  const { roomName } = useParams<{ roomName: string }>();

  useEffect(() => {
    const handleSuccess = () => {
      setStatus(RoomState.Joined);
    };

    const handleError = (errorMessage: string) => {
      setStatus(RoomState.Failed);
      setErrorMessage(errorMessage);
    };
    gameIO.emit(RoomEvent.Joining, roomName);

    gameIO.on(RoomEvent.JoinSuccess, handleSuccess);
    gameIO.on(RoomEvent.JoinError, handleError);

    return () => {
      gameIO.off(RoomEvent.JoinSuccess, handleSuccess);
      gameIO.off(RoomEvent.JoinError, handleError);
    };
  }, [roomName]);
  const { userName } = useUserData();

  const { setCardState, shuffledDeck, opponent, player, table, playerStack, opponentStack } = useCardState();

  const playCardOnTable = () => {
    if (activePlayerCard) {
      setCardState((state) => ({
        ...state,
        player: state.player.filter((c) => cardKey(c) !== activePlayerCard),
        table: [...state.table, fromCardKey(activePlayerCard)],
      }));
      togglePlayerActive(null);
    }
  };

  useEffect(() => {
    if (activePlayerCard && activeTableCards) {
      const playerCardNumber = fromCardKey(activePlayerCard)[0];
      const tableCardsSum = sum(activeTableCards.map((c) => fromCardKey(c)[0]));
      if (playerCardNumber === tableCardsSum) {
        setCardState((state) => ({
          ...state,
          player: state.player.filter((c) => cardKey(c) !== activePlayerCard),
          table: state.table.filter((c) => !activeTableCards.includes(cardKey(c))),
          playerStack: [...state.playerStack, ...fromCardKeys(activeTableCards), fromCardKey(activePlayerCard)],
        }));
        togglePlayerActive(null);
        toggleTableActive([]);
      }
    }
  }, [activePlayerCard, activeTableCards, setCardState]);

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
              <Deck cardNumber={opponentStack.length} />
              {opponent.map((c) => (
                <Card key={cardKey(c)} card={c} faceDown />
              ))}
            </Flex>
            <Text>Opponents</Text>
            <Flex
              sx={{ m: 3, gap: 3, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}
              role="button"
              onClick={playCardOnTable}
            >
              <Deck cardNumber={shuffledDeck.length} title={`${shuffledDeck.length} cards left`} />
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
            <Text> You ({userName})</Text>
            <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginBottom: '-3vw' }}>
              <Deck cardNumber={playerStack.length} />

              {player.map((c) => {
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
