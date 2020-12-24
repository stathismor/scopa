import { cardDrop, cardWrapper, BOARD_MIN_WIDTH } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Box, Flex, Grid } from 'theme-ui';
import { cardKey } from 'utils/cards';
import { Card } from './Cards/Card';
import { Deck as DeckType, GameTurnEvent } from 'shared';
import { Deck } from './Cards/Deck';
import { gameIO } from 'lib/socket';
import { useParams } from 'react-router-dom';

type Props = {
  table: DeckType;
  deck: DeckType;
  activeCardsOnTable: string[];
  movingCards: string[];
  activePlayerCard: string | null;
  playCardOnTable: () => void;
};

export const Board = ({ table, deck, activeCardsOnTable, movingCards, activePlayerCard, playCardOnTable }: Props) => {
  const { roomName } = useParams<{ roomName: string }>();

  return (
    <Flex sx={{ flex: 1, alignItems: 'center', minWidth: BOARD_MIN_WIDTH }}>
      <Deck cardNumber={deck.length} title={`${deck.length} cards left`} />
      <Box pl={[4, null, 5]} />
      <Grid sx={{ alignContent: 'center', flex: 1 }} columns="1fr 1fr 1fr 1fr" gap={[2, null, 3]}>
        {table.map((c) => {
          const key = cardKey(c);
          const isActive = activeCardsOnTable.includes(key);
          const needsToMove = movingCards.includes(key);
          return (
            <CardWrapper
              key={key}
              isMoving={needsToMove}
              sx={cardWrapper(isActive)}
              onClick={() => {
                gameIO.emit(
                  GameTurnEvent.SelectTableCards,
                  roomName,
                  isActive ? activeCardsOnTable.filter((c) => c !== key) : [...activeCardsOnTable, key],
                );
              }}
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
        {activePlayerCard && <Box role="button" sx={cardDrop} onClick={playCardOnTable} />}
      </Grid>
    </Flex>
  );
};
