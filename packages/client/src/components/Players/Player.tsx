import { Card } from 'components/Cards/Card';
import { CardWrapper } from 'components/Cards/CardWrapper';
import { Deck } from 'components/Cards/Deck';
import { playerCardWrapper } from 'components/Cards/style';
import { InvitePlayer } from 'components/InvitePlayer';
import { noop } from 'lodash';
import { PlayerState } from 'shared';
import { Box, BoxProps, Flex, Text } from 'theme-ui';
import { cardKey } from 'utils/cards';

type Props = {
  player: PlayerState;
  activePlayer: string | null;
  movingCards: string[];
  togglePlayerActiveCard: React.Dispatch<React.SetStateAction<string | null>>;
  activePlayerCard: string | null;
};

export const Player = ({
  player,
  activePlayer,
  movingCards,
  togglePlayerActiveCard,
  activePlayerCard,
  ...rest
}: Props & BoxProps) => {
  if (!player) {
    return <InvitePlayer />;
  }
  const { username, captured, hand } = player;
  const isActive = activePlayer === username;
  return (
    <Box {...rest}>
      <Text>
        You ({username}) {isActive && 'Active Player'}
      </Text>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap', marginBottom: '-3vw' }}>
        <Deck cardNumber={captured.length} />

        {hand?.map((c) => {
          const key = cardKey(c);
          return (
            <CardWrapper
              key={key}
              isMoving={movingCards.includes(key)}
              sx={playerCardWrapper(activePlayerCard === key)}
              onClick={isActive ? () => togglePlayerActiveCard((state) => (state === key ? null : key)) : noop}
            >
              <Card card={c} />
            </CardWrapper>
          );
        })}
      </Flex>
    </Box>
  );
};
