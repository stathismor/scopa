import { shuffle } from 'lodash';

import { generateDeck } from 'shared';
import { Deck } from 'shared';

export function generateRoomName(): string {
	return Math.random().toString(36).substring(4);
}

export function generateUsername(): string {
	return Math.random().toString(36).substring(4);
}

export function generateGameState(usernames: string[]) {
	const activePlayer = usernames[Math.floor(Math.random() * usernames.length)];
	const deck = shuffle(generateDeck());
	const players = usernames.map((username) => {
		const hand = deck.splice(0, 3);
		return generatePlayerState(username, hand);
	});
	const table = deck.splice(0, 4);

	return { status: 'Playing', activePlayer, deck: generateDeck(), table, players };
}

function generatePlayerState(username: string, hand: Deck) {
	return {
		username,
		hand,
		captured: [],
		scopa: [],
	};
}
