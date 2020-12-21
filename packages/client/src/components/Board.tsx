import { Dispatch, SetStateAction } from 'react';
import { cardDrop, cardWrapper } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Box, Grid } from 'theme-ui';
import { cardKey } from 'utils/cards';
import { Card } from './Cards/Card';
import { Deck } from 'shared';

type Props = {
  table: Deck;
  activeCardsOnTable: string[];
  movingCards: string[];
  toggleActiveCardsOnTable: Dispatch<SetStateAction<string[]>>;
  activePlayerCard: string | null;
  playCardOnTable: () => void;
};

export const Board = ({
  table,
  activeCardsOnTable,
  movingCards,
  toggleActiveCardsOnTable,
  activePlayerCard,
  playCardOnTable,
}: Props) => {
  
  return (
    <Grid sx={{ mx: 3, alignContent: 'center', flex: 1 }} columns="1fr 1fr 1fr 1fr" gap={3}>
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
  );
};
