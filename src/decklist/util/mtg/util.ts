import { setMainDeck } from "../../../store/slices/uiSlice";

import { AppDispatch } from "../../../store";
import { Card, Deck, mtgCard } from "../../../types";
import { binomial } from "./../deckAnalytics";

import {MTG_HAND_START_SIZE, MTG_MAX_COPIES} from "./constants";

import { TFunction } from "i18next";

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

  for (let k = 0; k <= MTG_HAND_START_SIZE; k++) {
    const p =
      (binomial(totalLands, k) * binomial(totalCards - totalLands, MTG_HAND_START_SIZE - k)) /
      binomial(totalCards, MTG_HAND_START_SIZE);
    probabilities.push(Number((p * 100).toPrecision(4)));
  }

  return probabilities;
};