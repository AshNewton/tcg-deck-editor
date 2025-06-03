import { setMainDeck } from "../../store/slices/uiSlice";

import { AppDispatch } from "../../store";
import { Card, Deck } from "../../types";

export const NAME = "Magic the Gathering";

export const MTG_MIN_STAT = 0;

export const MTG_MAX_STAT = 16;

export const MTG_STAT_STEP = 1;

export const MTG_HAND_START_SIZE = 7;

export const MTG_MAX_COPIES = 4;

export const isBasicLand = (card: Card) => {
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
