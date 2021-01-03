import { Dispatch, SetStateAction } from 'react';

import { GameState, PlayerAction, PlayerActionType } from 'shared';

interface AnimationCard {
  cards: string[];
  config: object;
  completed: boolean;
  callback?: () => void;
}

export type AnimationGroup = AnimationCard[];

export type Animations = AnimationGroup[];

export function getAnimations(playerAction: PlayerAction, gameState: GameState) {
  const animations = [];
  console.log('getAnimations:gameState', gameState);

  if (playerAction.action === PlayerActionType.PlayOnTable) {
    const animationGroup = [
      {
        cards: [playerAction.card],
        // TODO: Need to figure out proper config/position here
        config: { y: -250 },
        completed: false,
      },
    ];
    animations.push(animationGroup);
  }

  return animations;
}

export function processAnimations(
  playerAction: PlayerAction,
  gameState: GameState,
  setAnimations: Dispatch<SetStateAction<any>>,
  setGameState: Dispatch<SetStateAction<any>>,
) {
  const animations = getAnimations(playerAction, gameState);

  // Attach callback
  animations.map((animationGroup, index) =>
    animationGroup.map(
      (card) =>
        (card['callback'] = () => updateAnimations(animations, index, gameState, setAnimations, setGameState, card)),
    ),
  );

  processAnimationGroup(animations, gameState, 0, setAnimations, setGameState);
}

function processAnimationGroup(
  animations: AnimationGroup[],
  gameState: GameState,
  index: number,
  setAnimations: Dispatch<SetStateAction<any>>,
  setGameState: Dispatch<SetStateAction<any>>,
) {
  const animationGroup = animations[0];
  const groupCompleted = animationGroup.every((card: AnimationCard) => card.completed);
  if (groupCompleted) {
    updateAnimations(animations, index + 1, gameState, setAnimations, setGameState);
    return;
  }

  setAnimations(animationGroup);
}

function updateAnimations(
  animations: AnimationGroup[],
  index: number,
  gameState: GameState,
  setAnimations: Dispatch<SetStateAction<any>>,
  setGameState: Dispatch<SetStateAction<any>>,
  card?: AnimationCard,
) {
  // Exit condition for recursion, we have run all animations.
  if (index === animations.length) {
    setGameState(gameState);
    return;
  }

  if (card) {
    card.completed = true;
  }

  processAnimationGroup(animations, gameState, index, setAnimations, setGameState);
}
