import { Box, Grid } from 'theme-ui';
import { Deck as DeckType, cardKey } from 'shared';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { cardDrop, cardWrapper } from 'components/Cards/style';
import { Card } from './Cards/Card';
import { Deck } from './Cards/Deck';
import { DROP_CONTAINER_ID } from 'utils/dom';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  table: DeckType;
  deck: DeckType;
  activeCardsOnTable: string[];
  toggleActiveCardsOnTable: Dispatch<SetStateAction<string[]>>;
  activePlayerCard: string | null;
  playCardOnTable: () => void;
};

export const Board = ({
  table,
  deck,
  activeCardsOnTable,
  toggleActiveCardsOnTable,
  activePlayerCard,
  playCardOnTable,
}: Props) => {
  return (
    <>
      <Deck cardNumber={deck.length} title={`${deck.length} cards left`} />
      <Box pl={[4, null, 5]} />
      <Grid sx={{ alignContent: 'center', flex: 1 }} columns="1fr 1fr 1fr 1fr" gap={[2, null, 3]}>
        {table.map((c) => {
          const key = cardKey(c);
          const isActive = activeCardsOnTable.includes(key);
          return (
            <CardWrapper
              key={key}
              id={key}
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
        {activePlayerCard && (
          <Box role="button" onClick={playCardOnTable} id={DROP_CONTAINER_ID}>
            <Box sx={cardDrop} />
          </Box>
        )}
      </Grid>
    </>
  );
};
