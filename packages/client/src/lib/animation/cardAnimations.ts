import { move, MoveOptions } from './elementAnimations';
import { getElement, DROP_CONTAINER_ID, playerDeckId } from 'utils/dom';

export function animatePlace(cardWrap: ChildNode | null | undefined, options: MoveOptions = {}) {
  const dropElement = getElement(DROP_CONTAINER_ID);
  function moveCard() {
    dropElement?.removeChild(dropElement.firstChild!);
    dropElement?.appendChild(cardWrap!);
  }
  move([cardWrap], moveCard, options);
}

export function animateCapture(capturedCards: HTMLDivElement[], playerName: string, options: MoveOptions = {}) {
  const dropElement = getElement(playerDeckId(playerName));
  function moves() {
    capturedCards.forEach((el: HTMLDivElement) => {
      el.style.position = 'absolute';
      el.style.top = '0';
      dropElement?.appendChild(el);
    });
  }
  move(capturedCards, moves, {
    ...options,
    onComplete: () => {
      options?.onComplete?.();
      capturedCards.forEach((el) => {
        dropElement?.removeChild(el);
      });
    },
  });
}
