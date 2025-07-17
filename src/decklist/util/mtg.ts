import { setMainDeck } from "../../store/slices/uiSlice";

import { AppDispatch } from "../../store";
import { Card, Deck, mtgCard } from "../../types";
import { binomial } from "./deckAnalytics";

import { TFunction } from "i18next";

export const MTG_NAME = "Magic the Gathering";

export const MTG_MIN_STAT = 0;

export const MTG_MAX_STAT = 16;

export const MTG_MIN_MANA = 0;

export const MTG_MAX_MANA = 16;

export const MTG_STAT_STEP = 1;

export const MTG_COLORS = [
  "mtg.colorList.red",
  "mtg.colorList.blue",
  "mtg.colorList.green",
  "mtg.colorList.white",
  "mtg.colorList.black",
];

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
  "mtg.cardTypes.artifact",
  "mtg.cardTypes.basicLand",
  "mtg.cardTypes.battle",
  "mtg.cardTypes.creature",
  "mtg.cardTypes.enchantment",
  "mtg.cardTypes.equipment",
  "mtg.cardTypes.instant",
  "mtg.cardTypes.land",
  "mtg.cardTypes.legendary",
  "mtg.cardTypes.sorcery",
  "mtg.cardTypes.planeswalker",
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
  return (
    "type_line" in card.details &&
    (card.details as mtgCard)?.type_line?.includes("Basic Land")
  );
};

export const isMtgCard = (card: any): card is mtgCard => {
  return (
    typeof card === "object" &&
    typeof card.name === "string" &&
    typeof card.type_line === "string"
  );
};

export const isInvalid = (t: TFunction, maindeck: Deck, _extradeck: Deck) => {
  const errors: any = {};

  const totalCards = maindeck.reduce((acc, card) => {
    acc += card.copies;
    return acc;
  }, 0);

  if (totalCards < 60) {
    errors.tooSmall = t("mtg.errors.tooSmall");
  }

  if (
    maindeck.some((card: Card) => {
      return card.copies > MTG_MAX_COPIES && !isBasicLand(card);
    })
  ) {
    errors.tooManyCopies = t("mtg.errors.tooManyCopies");
  }

  return errors;
};

export const handleAddToDeck = (
  newCard: Card,
  maindeck: Deck,
  _extradeck: Deck,
  dispatch: AppDispatch
) => {
  if (!Boolean(newCard)) {
    dispatch(setMainDeck(maindeck));
    return;
  }

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
    .filter((card) => (card.details as mtgCard).type_line.includes("Land"))
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
