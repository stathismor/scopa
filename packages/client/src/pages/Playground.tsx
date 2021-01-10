import { Box } from 'theme-ui';
import { Link } from 'react-router-dom';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { Layout } from 'components/Layout';
import { Suit } from 'shared';
import { theme } from 'theme';
import { Player } from 'components/Players/Player';
import { Board } from 'components/Board';
import { GameTable } from 'components/GameTable';
import { useState } from 'react';
import { move } from 'lib/animation/elementAnimations';

const SETTEBELLO = {
  value: 7,
  suit: Suit.Golds,
};
const FIVE = {
  value: 5,
  suit: Suit.Golds,
};
const SIX = {
  value: 6,
  suit: Suit.Golds,
};
const TWO = {
  value: 2,
  suit: Suit.Golds,
};

const animateCardOnTable = (activePlayerCard: string, options: Record<string, unknown> = {}) => {
  const cardWrap = document.querySelector(`#card_${activePlayerCard}`);
  const dropElement = document.querySelector('#drop-container');
  console.log(cardWrap, dropElement);
  console.log('Emit: Card is going to the table');
  function moveCard() {
    dropElement?.removeChild(dropElement.firstChild!);
    dropElement?.appendChild(cardWrap!);
  }
  move([cardWrap], moveCard, options);
};

// const animateCapture = (caputeredCards: string[], options: Record<string, unknown> = {}) => {
//   const cardWraps = caputeredCards.map((cardKey) => document.querySelector(`#card_${cardKey}`));
//   const dropElement = document.querySelector(`#player-deck`);
//   console.log(cardWraps, dropElement);
//   function moveCards() {
//     cardWraps.forEach((el) => dropElement?.appendChild(el!));
//   }
//   move(cardWraps, moveCards, options);
// };

export const Playground = () => {
  const [activePlayerCard, togglePlayerActiveCard] = useState<string | null>(null);
  const [activeCardsOnTable, toggleActiveCardsOnTable] = useState<string[]>([]);
  console.count('render');
  const playCardOnTable = () => {
    if (activePlayerCard) {
      animateCardOnTable(activePlayerCard, {
        onComplete: () => {
          console.log('tx complete');
          togglePlayerActiveCard(null);
        },
      });
    }
  };
  return (
    <Layout>
      <Box sx={{ position: 'absolute', left: 1, top: 1 }}>
        <Link to="/" aria-label="Back to Lobby">
          <FiArrowLeftCircle title="Back to Lobby" size={24} color={theme.colors.text} />
        </Link>
      </Box>
      <GameTable>
        <Board
          table={[SETTEBELLO]}
          deck={[SETTEBELLO]}
          activeCardsOnTable={activeCardsOnTable}
          toggleActiveCardsOnTable={() => toggleActiveCardsOnTable([''])}
          activePlayerCard={activePlayerCard}
          playCardOnTable={playCardOnTable}
        />

        <Player
          player={{
            captured: [],
            hand: [FIVE, SIX, TWO],
            scopa: [],
            username: 'Den',
          }}
          isActive={true}
          togglePlayerActiveCard={togglePlayerActiveCard}
          activePlayerCard={activePlayerCard}
        />
      </GameTable>
    </Layout>
  );
};
