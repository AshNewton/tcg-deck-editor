export const getDeckSize = (deck) => {
  return deck.reduce((acc, item) => {
    acc += item.copies;
    return acc;
  }, 0);
};

export const getStartingHand = (deck) => {
  // expand the deck out by number of copies of each card
  const expanded = deck.flatMap((card) => Array(card.copies).fill(card.name));

  // shuffle deck
  for (let i = expanded.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
  }

  // get 5 random names
  const uniqueNames = [...new Set(expanded)];

  return uniqueNames.slice(0, 5);
};

const binomial = (n, k) => {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res *= (n - i + 1) / i;
  }
  return res;
};

export const getChanceToOpenCards = (deck) => {
  const totalCopies = deck.reduce((sum, card) => sum + card.copies, 0);

  return deck.map((card) => {
    const k = card.copies;
    const N = totalCopies;
    const n = 5;

    const pZero = binomial(N - k, n) / binomial(N, n);
    const pAtLeastOne = 1 - pZero;

    return {
      name: card.name,
      copies: k,
      chance: (pAtLeastOne * 100).toFixed(2) + "%",
    };
  });
};
