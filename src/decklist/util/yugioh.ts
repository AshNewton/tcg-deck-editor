import { AlertProps } from "@mui/material";

import { BanType, Card } from "../../types";

export const YUGIOH_MIN_STAT = 0;

export const YUGIOH_MAX_STAT = 5000;

export const YUGIOH_STAT_STEP = 25;

export const YUGIOH_HAND_START_SIZE = 5;

export const YUGIOH_ATTRIBUTES = [
  "DARK",
  "LIGHT",
  "EARTH",
  "FIRE",
  "WATER",
  "WIND",
  "DIVINE",
];

export const YUGIOH_CARD_TYPES = [
  "Normal Monster",
  "Effect",
  "Fusion",
  "Synchro",
  "XYZ",
  "Ritual",
  "Pendulum",
  "Link",
];

export const YUGIOH_SPELL_TYPES = [
  "Normal Spell",
  "Equip Spell",
  "Field Spell",
  "Continuous Spell",
  "Quick-Play Spell",
  "Ritual Spell",
];

export const YUGIOH_TRAP_TYPES = [
  "Normal Trap",
  "Continuous Trap",
  "Counter Trap",
];

export const YUGIOH_MONSTER_LEVELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
];

export const YUGIOH_MONSTER_TYPES = [
  "Aqua",
  "Beast",
  "Beast-Warrior",
  "Cyberse",
  "Dinosaur",
  "Divine-Beast",
  "Dragon",
  "Fairy",
  "Fiend",
  "Fish",
  "Illusion",
  "Insect",
  "Machine",
  "Plant",
  "Psychic",
  "Pyro",
  "Reptile",
  "Rock",
  "Sea Serpent",
  "Spellcaster",
  "Thunder",
  "Warrior",
  "Winged Beast",
  "Wyrm",
  "Zombie",
];

export const YUGIOH_MONSTER_ABILITIES = [
  "Tuner",
  "Flip",
  "Union",
  "Spirit",
  "Gemini",
  "Toon",
];

export const getBannedSeverity = (banType: BanType): AlertProps["severity"] => {
  switch (banType) {
    case "Forbidden":
      return "error";
    case "Limited":
      return "warning";
    case "Semi-Limited":
      return "warning";
    default:
      return "success";
  }
};

export const getCardLevelName = (card: Card | null): string => {
  return card?.details?.type === "Link Monster"
    ? "Link Rating"
    : card?.details?.type === "XYZ Monster"
    ? "Rank"
    : "Level";
};
