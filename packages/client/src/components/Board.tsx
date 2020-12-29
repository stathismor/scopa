import { ReactNode } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { cardDrop, cardWrapper, BOARD_MIN_WIDTH } from 'components/Cards/style';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Box, Flex, Grid } from 'theme-ui';
import { Card } from './Cards/Card';
import { Deck as DeckType, cardKey } from 'shared';
import { CAPTURE_CARDS_TARGET } from './Players/constants';

type Props = {
  table: DeckType;
  activeCardsOnTable: string[];
  movingCards?: string[];
  toggleActiveCardsOnTable: Dispatch<SetStateAction<string[]>>;
  activePlayerCard: string | null;
  playCardOnTable: () => void;
  moveTo: typeof CAPTURE_CARDS_TARGET['player'];
  children: ReactNode;
};

export const Board = ({
  table,
  activeCardsOnTable,
  movingCards,
  toggleActiveCardsOnTable,
  activePlayerCard,
  playCardOnTable,
  moveTo,
  children,
}: Props) => {
  return (
    <Flex sx={{ flex: 1, alignItems: 'center', minWidth: BOARD_MIN_WIDTH }}>
      {children}
      <Box pl={[4, null, 5]} />
      <Grid sx={{ alignContent: 'center', flex: 1 }} columns="1fr 1fr 1fr 1fr" gap={[2, null, 3]}>
        {table.map((c) => {
          const key = cardKey(c);
          const isActive = activeCardsOnTable.includes(key);
          const needsToMove = movingCards?.includes(key) ?? false;
          return (
            <CardWrapper
              key={key}
              moveTo={needsToMove ? moveTo : null}
              delay={needsToMove ? 600 : undefined}
              sx={cardWrapper(isActive)}
              onClick={() => {
                toggleActiveCardsOnTable(
                  isActive ? activeCardsOnTable.filter((c) => c !== key) : [...activeCardsOnTable, key],
                );
              }}
              onRest={() => {}}
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
