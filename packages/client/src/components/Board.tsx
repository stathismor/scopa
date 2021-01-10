import { Box, Flex, Grid } from 'theme-ui';
import { Deck as DeckType, cardKey } from 'shared';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { cardDrop, cardWrapper, BOARD_MIN_WIDTH } from 'components/Cards/style';
import { Card } from './Cards/Card';
import { Deck } from './Cards/Deck';
import { DROP_CONTAINER_ID } from 'utils/dom';

type Props = {
  table: DeckType;
  deck: DeckType;
  activeCardsOnTable: string[];
  toggleActiveCardsOnTable: (cardKey: string | null) => void;
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
    <Flex sx={{ flex: 1, alignItems: 'center', minWidth: BOARD_MIN_WIDTH }}>
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
                toggleActiveCardsOnTable(key);
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
    </Flex>
  );
};
