import { handleAddToDeck as mtgAddToDeck } from "./mtg";
import { handleAddToDeck as ygoAddToDeck } from "./yugioh";

import { MTG_HAND_START_SIZE, MTG_NAME } from "./mtg";
import { YUGIOH_HAND_START_SIZE, YUGIOH_NAME } from "./yugioh";

import { Game } from "../../types";

export const isYugioh = (game: Game): boolean => {
  return game === YUGIOH_NAME;
};

export const isMTG = (game: Game): boolean => {
  return game === MTG_NAME;
};

export const addToDeckHandlers: Record<Game, any> = {
  "Magic the Gathering": mtgAddToDeck,
  Yugioh: ygoAddToDeck,
};

export const getCardHandSize = (game: Game) => {
  switch (game) {
    case YUGIOH_NAME:
      return YUGIOH_HAND_START_SIZE;
    case MTG_NAME:
      return MTG_HAND_START_SIZE;
  }
};
