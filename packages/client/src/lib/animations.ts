import { Dispatch, SetStateAction } from 'react';

interface AnimationCard {
  name: string;
  options: object;
  completed: boolean;
  callback?: () => void;
}

export interface AnimationGroup {
  name: string;
  cards: AnimationCard[];
}

export function getAnimations() {
  // Dummy test animations
  const animations = [
    {
      name: 'move',
      cards: [
        {
          name: '3__Golds',
          options: {},
          completed: false,
        },
        {
          name: '6__Cups',
          options: {},
          completed: false,
        },
      ],
    },
    {
      name: 'move',
      cards: [
        {
          name: '3__Golds',
          options: {},
          completed: false,
        },
        {
          name: '6__Cups',
          options: {},
          completed: false,
        },
      ],
    },
  ];

  return animations;
}

export function processAnimations(setAnimations: Dispatch<SetStateAction<any>>) {
  const animations = getAnimations();

  // Attach callback
  animations.map((animation, index) =>
    animation.cards.map((card) => (card['callback'] = () => updateAnimations(animations, index, setAnimations, card))),
  );

  updateAnimations(animations, 0, setAnimations);
}

/**
 * It updates the card object to be completed. It if all animations for the group of that index have completed.
 * If yes, it moves on to the next group and sets that on the caller's state. Otherwise
 */
function updateAnimations(
  animations: AnimationGroup[],
  index: number,
  setAnimations: Dispatch<SetStateAction<any>>,
  card?: AnimationCard,
) {
  // Exit condition for recursion, we have run all animations.
  if (index === animations.length) {
    return;
  }

  if (card) {
    card.completed = true;
  }

  const animationGroup = animations[index];
  const groupCompleted = animationGroup.cards.every((card: AnimationCard) => card.completed);
  if (groupCompleted) {
    updateAnimations(animations, index + 1, setAnimations);
    return;
  }

  setAnimations(animationGroup);
}
