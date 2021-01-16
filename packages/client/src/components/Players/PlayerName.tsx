import { Box, Flex } from 'theme-ui';
import { FiStar } from 'react-icons/fi';
import { PlayerState } from 'shared';

export const PlayerName = ({ player, isActive }: { player: PlayerState; isActive: boolean }) => (
  <Flex sx={{ alignItems: 'center' }}>
    {player.username}
    <Box pl={2} />({player.score.total})
    <Box pl={2} />
    {isActive && <FiStar size={24} title="Active Player" />}
  </Flex>
);
