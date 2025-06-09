import { setExtraDeck, setMainDeck } from "../../store/slices/uiSlice";

import { AlertProps } from "@mui/material";
import { AppDispatch } from "../../store";
import { BanType, Card, Deck } from "../../types";

export const YUGIOH_NAME = "Yugioh";

export const YUGIOH_MIN_STAT = 0;

export const YUGIOH_MAX_STAT = 5000;

export const YUGIOH_STAT_STEP = 25;

export const YUGIOH_HAND_START_SIZE = 5;

export const YUGIOH_MAX_COPIES = 3;

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

export const isExtraDeckCard = (card: Card): boolean => {
  const extraTypes = [
    "Fusion Monster",
    "Synchro Monster",
    "XYZ Monster",
    "Link Monster",
  ];
  return extraTypes.includes(card?.details?.type);
};

export const handleAddToDeck = (
  newCard: Card,
  maindeck: Deck,
  _extradeck: Deck,
  dispatch: AppDispatch
) => {
  if (!Boolean(newCard)) {
    dispatch(setMainDeck(maindeck));
    dispatch(setExtraDeck(_extradeck));
    return;
  }

  // if card is already in deck, add a copy
  if (maindeck.find((card) => card.name === newCard.name)) {
    const updatedDeck = maindeck.map((card) =>
      card.name === newCard.name ? { ...card, copies: card.copies + 1 } : card
    );

    dispatch(setMainDeck(updatedDeck));
  } else if (_extradeck.find((card) => card.name === newCard.name)) {
    const updatedDeck = _extradeck.map((card) =>
      card.name === newCard.name ? { ...card, copies: card.copies + 1 } : card
    );

    dispatch(setExtraDeck(updatedDeck));
  } else {
    // card not already in deck, add it to main or extra based on type
    if (isExtraDeckCard(newCard)) {
      dispatch(setExtraDeck([..._extradeck, { ...newCard, copies: 1 }]));
    } else {
      dispatch(setMainDeck([...maindeck, { ...newCard, copies: 1 }]));
    }
  }
};
