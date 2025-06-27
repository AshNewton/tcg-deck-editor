import { MTG_NAME } from "./mtg";
import { POKEMON_NAME } from "./pokemon";
import { YUGIOH_NAME } from "./yugioh";

import mtgIcon from "../../icons/mtg.png";
import pokemonIcon from "../../icons/pokemon.png";
import yugiohIcon from "../../icons/ygo.png";

export const SUPPORTED_GAMES = [YUGIOH_NAME, MTG_NAME, POKEMON_NAME];

export const GAME_ICONS: Record<string, string> = {
  "Magic the Gathering": mtgIcon,
  "Pokemon TCG": pokemonIcon,
  Yugioh: yugiohIcon,
};

export const JSON_OPTS = {
  types: [
    {
      description: "JSON Files",
      accept: { "application/json": [".json"] },
    },
  ],
  suggestedName: "data.json",
};

export const TXT_OPTS = {
  suggestedName: "file.txt",
  types: [
    {
      description: "Text Files",
      accept: { "text/plain": [".txt"] },
    },
  ],
};

export const NEW_LINE = "\n";
