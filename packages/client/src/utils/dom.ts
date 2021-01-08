const SEPARATOR = '_';
export const CARD_ID_PREFIX = 'card';
export const DROP_CONTAINER_ID = 'drop-container';
export const PLAYER_DECK_ID = 'player-deck';

export function getElement(id: string | null) {
  return document.querySelector(`#${id}`);
}

export function getCardElement(cardKey: string | null) {
  return document.querySelector(`#${CARD_ID_PREFIX}${SEPARATOR}${cardKey}`)?.firstChild;
}
