import { Box, Flex } from 'theme-ui';
import { FiStar } from 'react-icons/fi';

export const PlayerName = ({ playerName, isActive }: { playerName: string; isActive: boolean }) => (
  <Flex sx={{ alignItems: 'center' }}>
    {playerName}
    <Box pl={2} />
    {isActive && <FiStar size={24} title="Active Player" />}
  </Flex>
);
