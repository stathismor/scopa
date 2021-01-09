import { Card, Heading, Text } from 'theme-ui';

export const Log = ({ event }: { event: string }) => {
  return (
    <Card sx={{ width: '25%' }}>
      <Heading as="h3" mt={2}>
        Log
      </Heading>
      <Text sx={{ fontSize: 2, fontWeight: 400 }}>{event}</Text>
    </Card>
  );
};
