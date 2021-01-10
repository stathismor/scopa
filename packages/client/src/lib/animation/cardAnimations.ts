import { move, MoveOptions } from './elementAnimations';
import { getElement, getCardElement, DROP_CONTAINER_ID, PLAYER_DECK_ID } from 'utils/dom';

export function animatePlace(cardWrap: ChildNode | null | undefined, options: MoveOptions = {}) {
  const dropElement = getElement(DROP_CONTAINER_ID);
  function moveCard() {
    dropElement?.removeChild(dropElement.firstChild!);
    dropElement?.appendChild(cardWrap!);
  }
  move([cardWrap], moveCard, options);
}

export function animateCapture(
  animatedCard: HTMLDivElement,
  capturedCards: string[],
  playerName: string,
  options: MoveOptions = {},
) {
  const cardWraps = capturedCards.map((cardKey) => getCardElement(cardKey)).concat([animatedCard]) as HTMLDivElement[];
  const dropElement = getElement(`${PLAYER_DECK_ID}__${playerName}`);
  function moves() {
    cardWraps.forEach((el: HTMLDivElement) => {
      el.style.position = 'absolute';
      el.style.top = '0';
      dropElement?.appendChild(el);
    });
  }
  move(cardWraps, moves, {
    ...options,
    onComplete: () => {
      options?.onComplete?.();
      cardWraps.forEach((el) => {
        dropElement?.removeChild(el);
      });
    },
  });
}
