import { Flex, Heading } from 'theme-ui';
import { SUIT } from 'utils/cardEngine';
import { range } from 'lodash';
import { Card } from 'components/Card';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';

export const Game = () => {
  return (
    <Layout>
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Link to="/">Back</Link>
        <Heading as="h1">Scopa</Heading>
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Golds]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Clubs]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Cups]} />
        ))}
      </Flex>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, SUIT.Swords]} />
        ))}
      </Flex>
    </Layout>
  );
};
