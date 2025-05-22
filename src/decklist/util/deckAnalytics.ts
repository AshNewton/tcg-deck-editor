import { CardOpeningProbabilities, Deck } from "../../types";

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

const binomial = (n: number, k: number): number => {
  if (k > n) return 0;
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
