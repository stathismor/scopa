import { Box, Heading, Text } from 'theme-ui';

export const Log = ({ event }: { event: string }) => {
  return (
    <Box sx={{ borderLeft: '2px solid', borderColor: 'text', pl: 3 }}>
      <Heading as="h3" mt={2}>
        Log
      </Heading>
      <Text sx={{ fontSize: 2, fontWeight: 400 }}>{event}</Text>
    </Box>
  );
};
