export const deckSize = (deck) => {
  return deck.reduce((acc, item) => {
    acc += item.copies;
    return acc;
  }, 0);
};
