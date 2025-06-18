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
