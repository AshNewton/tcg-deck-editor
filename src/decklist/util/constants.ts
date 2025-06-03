import { NAME as MTG_NAME } from "./mtg";
import { NAME as YGO_NAME } from "./yugioh";

import yugiohIcon from "../icons/ygo.png";
import mtgIcon from "../icons/mtg.png";

export const SUPPORTED_GAMES = [YGO_NAME, MTG_NAME];

export const GAME_ICONS: Record<string, string> = {
  Yugioh: yugiohIcon,
  "Magic the Gathering": mtgIcon,
};
