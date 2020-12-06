import { Flex, Heading } from 'theme-ui';
import { Suit } from 'shared';
import { range } from 'lodash';
import { Card } from 'components/Cards/Card';
import { Deck } from 'components/Cards/Deck';
import { Layout } from 'components/Layout';

export const UiDocs = () => {
  return (
    <Layout>
      <Heading as="h2" my={3}>
        Decks with evelevations, 40 cards, 30, 20, 10, 0
      </Heading>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        <Deck cardLeft={40} title="40 cards" />
        <Deck cardLeft={30} title="30 cards" />
        <Deck cardLeft={20} title="20 cards" />
        <Deck cardLeft={10} title="10 cards" />
        <Deck cardLeft={0} title="Empty" />
      </Flex>
      <Heading as="h2" my={3}>
        {Suit.Golds}
      </Heading>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, Suit.Golds]} />
        ))}
      </Flex>
      <Heading as="h2" my={3}>
        {Suit.Clubs}
      </Heading>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, Suit.Clubs]} />
        ))}
      </Flex>
      <Heading as="h2" my={3}>
        {Suit.Cups}
      </Heading>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, Suit.Cups]} />
        ))}
      </Flex>
      <Heading as="h2" my={3}>
        {Suit.Swords}
      </Heading>
      <Flex sx={{ m: 3, gap: 3, flexWrap: 'wrap' }}>
        {range(1, 11).map((r) => (
          <Card key={r} card={[r, Suit.Swords]} />
        ))}
      </Flex>
    </Layout>
  );
};
