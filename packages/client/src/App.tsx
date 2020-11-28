import { Card } from './Card';
import { Box, Flex, Heading } from 'theme-ui';
import { SUIT } from 'cards';
import { range } from 'lodash';

function App() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        m: '0 auto',
      }}
    >
      <Heading as="h1">Scopa</Heading>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Denari]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Bastoni]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Coppe]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Spade]} />
        ))}
      </Flex>
    </Box>
  );
}

export default App;
