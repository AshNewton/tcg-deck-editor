import { setMainDeck } from "../../store/slices/uiSlice";

import { AppDispatch } from "../../store";
import { Card, Deck } from "../../types";
import { binomial } from "./deckAnalytics";

export const MTG_NAME = "Magic the Gathering";

export const MTG_MIN_STAT = 0;

export const MTG_MAX_STAT = 16;

export const MTG_MIN_MANA = 0;

export const MTG_MAX_MANA = 16;

export const MTG_STAT_STEP = 1;

export const MTG_COLORS = ["Red", "Blue", "Black", "Green", "White"];

export const MTG_COLOR_CODES: Record<
  "White" | "Blue" | "Black" | "Red" | "Green",
  "W" | "U" | "B" | "R" | "G"
> = {
  White: "W",
  Blue: "U",
  Black: "B",
  Red: "R",
  Green: "G",
};

export const MTG_COLORLESS_CODE = "C";

export const MTG_CARD_TYPES = [
  "Legendary",
  "Instant",
  "Sorcery",
  "Equipment",
  "Battle",
  "Artifact",
  "Creature",
  "Planeswalker",
  "Land",
  "Basic Land",
  "Enchantment",
];

export const MTG_HAND_START_SIZE = 7;

export const MTG_MAX_COPIES = 4;

export const MTG_TYPELINE_SEPERATOR = "—";

export const MTG_COLORS_HEX: Record<string, string> = {
  W: "#f8f2c8",
  U: "#93c4e0",
  B: "#5e5e5e",
  R: "#f29393",
  G: "#a7d7a2",
};

export const isBasicLand = (card: Card): boolean => {
  return card.details?.type_line?.includes("Basic Land");
};

export const handleAddToDeck = (
  newCard: Card,
  maindeck: Deck,
  _extradeck: Deck,
  dispatch: AppDispatch
) => {
  // if card is already in deck, add a copy
  if (maindeck.find((card) => card.name === newCard.name)) {
    const updatedDeck = maindeck.map((card) =>
      card.name === newCard.name ? { ...card, copies: card.copies + 1 } : card
    );

    dispatch(setMainDeck(updatedDeck));
  } else {
    // card not already in deck, add it to deck with one copy

    dispatch(setMainDeck([...maindeck, { ...newCard, copies: 1 }]));
  }
};

export const getLandProbabilities = (deck: Deck) => {
  const totalCards = deck.reduce((sum, card) => sum + card.copies, 0);

  const totalLands = deck
    .filter((card) => card.details.type_line.includes("Land"))
    .reduce((sum, card) => sum + card.copies, 0);

  const probabilities: number[] = [];

  for (let k = 0; k <= 7; k++) {
    const p =
      (binomial(totalLands, k) * binomial(totalCards - totalLands, 7 - k)) /
      binomial(totalCards, 7);
    probabilities.push(Number((p * 100).toPrecision(4)));
  }

  return probabilities;
};
