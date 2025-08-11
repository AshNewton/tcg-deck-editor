import { Card, CardOpeningProbabilities, Deck } from "../../types";

import { YUGIOH_HAND_START_SIZE } from "./yugioh";

export const getDeckSize = (deck: Deck): number => {
  return deck.reduce((acc, card) => {
    acc += card.copies;
    return acc;
  }, 0);
};

export const getStartingHand = (
  deck: Deck,
  handSize: number = YUGIOH_HAND_START_SIZE
): Array<string> => {
  // expand the deck out by number of copies of each card
  const expanded = deck.flatMap((card) => Array(card.copies).fill(card.name));

  // shuffle deck
  for (let i = expanded.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
  }

  // get names from randomized list
  return expanded.slice(0, handSize);
};

export const shuffleDeck = (deck: Deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const getCardDraw = (
  deck: Deck,
  hand: Array<string>,
  numberToDraw = 1
): Array<string> => {
  // count how many times each card appears in hand
  const handCounts = new Map<string, number>();
  for (const cardname of hand) {
    handCounts.set(cardname, (handCounts.get(cardname) || 0) + 1);
  }

  // update the deck based on the hand counts
  const updated = deck.map((card: Card) => {
    const countInHand = handCounts.get(card.name) || 0;
    return {
      ...card,
      copies: card.copies - countInHand,
    };
  });

  // expand the deck out by number of copies of each card
  const expanded = updated.flatMap((card) =>
    Array(card.copies).fill(card.name)
  );

  // shuffle deck
  for (let i = expanded.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
  }

  // get names from randomized list
  return expanded.slice(0, numberToDraw);
};

export const binomial = (n: number, k: number): number => {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res *= (n - i + 1) / i;
  }
  return res;
};

export const getChanceToOpenCards = (
  deck: Deck,
  handSize: number = YUGIOH_HAND_START_SIZE
): CardOpeningProbabilities => {
  const totalCopies = deck.reduce((sum, card) => sum + card.copies, 0);

  return deck.map((card) => {
    const k = card.copies;
    const N = totalCopies;
    const n = handSize;

    const pZero = binomial(N - k, n) / binomial(N, n);
    const pAtLeastOne = 1 - pZero;

    return {
      name: card.name,
      chance: (pAtLeastOne * 100).toFixed(2) + "%",
    };
  });
};
