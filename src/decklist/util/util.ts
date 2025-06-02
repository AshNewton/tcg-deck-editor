import { handleAddToDeck as mtgAddToDeck, NAME as MTG_NAME } from "./mtg";
import { handleAddToDeck as ygoAddToDeck, NAME as YGO_NAME } from "./yugioh";

import { Game } from "../../types";

export const isYugioh = (game: Game): boolean => {
  return game === YGO_NAME;
};

export const isMTG = (game: Game): boolean => {
  return game === MTG_NAME;
};

export const addToDeckHandlers: Record<Game, any> = {
  "Magic the Gathering": mtgAddToDeck,
  Yugioh: ygoAddToDeck,
};
