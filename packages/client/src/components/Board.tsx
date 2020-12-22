import { Dispatch, SetStateAction } from 'react';
import { cardDrop, cardWrapper } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Box, Flex, Grid } from 'theme-ui';
import { cardKey } from 'utils/cards';
import { Card } from './Cards/Card';
import { Deck as DeckType } from 'shared';
import { Deck } from './Cards/Deck';

type Props = {
  table: DeckType;
  deck: DeckType;
  activeCardsOnTable: string[];
  movingCards: string[];
  toggleActiveCardsOnTable: Dispatch<SetStateAction<string[]>>;
  activePlayerCard: string | null;
  playCardOnTable: () => void;
};

export const Board = ({
  table,
  deck,
  activeCardsOnTable,
  movingCards,
  toggleActiveCardsOnTable,
  activePlayerCard,
  playCardOnTable,
}: Props) => {
  return (
    <Flex sx={{ flex: 1, gap: 5, alignItems: 'center' }}>
      <Deck cardNumber={deck.length} title={`${deck.length} cards left`} />

      <Grid sx={{ mx: 3, alignContent: 'center' }} columns="1fr 1fr 1fr 1fr" gap={3}>
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
                toggleActiveCardsOnTable(
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
