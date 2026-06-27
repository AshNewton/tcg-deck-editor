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
