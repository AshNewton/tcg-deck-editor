import { YUGIOH_NAME } from "./yugioh";
import { MTG_NAME } from "./mtg";

import yugiohIcon from "../icons/ygo.png";
import mtgIcon from "../icons/mtg.png";

export const SUPPORTED_GAMES = [YUGIOH_NAME, MTG_NAME];

export const GAME_ICONS: Record<string, string> = {
  Yugioh: yugiohIcon,
  "Magic the Gathering": mtgIcon,
};
