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
