import { Box, Heading, Text } from 'theme-ui';

export const Log = ({ event = '' }: { event?: string }) => {
  return (
    <Box
      sx={{
        borderLeft: ['none', null, '2px solid'],
        borderTop: ['2px solid', null, 'none'],
        borderColor: 'text',
        p: 3,
      }}
    >
      <Heading as="h3" mt={2}>
        Log
      </Heading>
      <Text sx={{ fontSize: 2, fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: event }} />
    </Box>
  );
};
