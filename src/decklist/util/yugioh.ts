import { setExtraDeck, setMainDeck } from "../../store/slices/uiSlice";

import { AlertProps } from "@mui/material";
import { AppDispatch } from "../../store";
import { BanType, Card, Deck, ygoCard } from "../../types";

import { TFunction } from "i18next";

export const YUGIOH_NAME = "Yugioh";

export const YUGIOH_MIN_STAT = 0;

export const YUGIOH_MAX_STAT = 5000;

export const YUGIOH_STAT_STEP = 25;

export const YUGIOH_HAND_START_SIZE = 5;

export const YUGIOH_MAX_COPIES = 3;

export const YUGIOH_ATTRIBUTES = [
  "yugioh.attributeList.dark",
  "yugioh.attributeList.light",
  "yugioh.attributeList.earth",
  "yugioh.attributeList.fire",
  "yugioh.attributeList.water",
  "yugioh.attributeList.wind",
  "yugioh.attributeList.divine",
];

export const YUGIOH_CARD_TYPES = [
  "yugioh.cardTypeList.effect",
  "yugioh.cardTypeList.fusion",
  "yugioh.cardTypeList.link",
  "yugioh.cardTypeList.normal",
  "yugioh.cardTypeList.pendulum",
  "yugioh.cardTypeList.ritual",
  "yugioh.cardTypeList.synchro",
  "yugioh.cardTypeList.xyz",
];

export const YUGIOH_SPELL_TYPES = [
  "yugioh.spellTypeList.continuous",
  "yugioh.spellTypeList.equip",
  "yugioh.spellTypeList.field",
  "yugioh.spellTypeList.normal",
  "yugioh.spellTypeList.quickPlay",
  "yugioh.spellTypeList.ritual",
];

export const YUGIOH_TRAP_TYPES = [
  "yugioh.trapTypeList.continuous",
  "yugioh.trapTypeList.counter",
  "yugioh.trapTypeList.normal",
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
  "yugioh.monsterTypeList.aqua",
  "yugioh.monsterTypeList.xyz",
  "yugioh.monsterTypeList.beastWarrior",
  "yugioh.monsterTypeList.cyberse",
  "yugioh.monsterTypeList.dinosaur",
  "yugioh.monsterTypeList.divineBeast",
  "yugioh.monsterTypeList.dragon",
  "yugioh.monsterTypeList.fairy",
  "yugioh.monsterTypeList.fiend",
  "yugioh.monsterTypeList.fish",
  "yugioh.monsterTypeList.illusion",
  "yugioh.monsterTypeList.insect",
  "yugioh.monsterTypeList.machine",
  "yugioh.monsterTypeList.plant",
  "yugioh.monsterTypeList.psychic",
  "yugioh.monsterTypeList.pyro",
  "yugioh.monsterTypeList.reptile",
  "yugioh.monsterTypeList.rock",
  "yugioh.monsterTypeList.seaSerpent",
  "yugioh.monsterTypeList.spellcaster",
  "yugioh.monsterTypeList.thunder",
  "yugioh.monsterTypeList.warrior",
  "yugioh.monsterTypeList.wingedBeast",
  "yugioh.monsterTypeList.wyrm",
  "yugioh.monsterTypeList.zombie",
];

export const isYgoCard = (card: any): card is ygoCard => {
  return (
    typeof card === "object" &&
    typeof card.name === "string" &&
    typeof card.type === "string"
  );
};

export const getBannedSeverity = (
  banType: BanType | undefined
): AlertProps["severity"] => {
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

export const getCardLevelName = (card: ygoCard | null): string => {
  return card?.type === "Link Monster"
    ? "Link Rating"
    : card?.type === "XYZ Monster"
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
  return extraTypes.includes((card?.details as ygoCard)?.type);
};

export const isInvalid = (t: TFunction, maindeck: Deck, _extradeck: Deck) => {
  const errors: any = {};

  const totalCards = maindeck.reduce((acc, card) => {
    acc += card.copies;
    return acc;
  }, 0);

  if (totalCards < 40) {
    errors.tooSmall = t("yugioh.errors.tooSmall");
  }

  if (totalCards > 60) {
    errors.tooLarge = t("yugioh.errors.tooLarge");
  }

  const totalExtraCards = _extradeck.reduce((acc, card) => {
    acc += card.copies;
    return acc;
  }, 0);

  if (totalExtraCards > 15) {
    errors.tooLargeExtra = t("yugioh.errors.tooLargeExtra");
  }

  [...maindeck, ..._extradeck].forEach((card: Card) => {
    const cardLegality = (card?.details as ygoCard)?.banlist_info?.ban_tcg;

    switch (cardLegality) {
      case "Forbidden":
        errors.forbidden = t("yugioh.errors.forbidden", { name: card.name });
        break;
      case "Limited":
        if (card.copies > 1) {
          errors.limited = t("yugioh.errors.limited", { name: card.name });
        }
        break;
      case "Semi-Limited":
        if (card.copies > 2) {
          errors.semiLimited = t("yugioh.errors.semiLimited", {
            name: card.name,
          });
        }
        break;
      default:
        if (card.copies > YUGIOH_MAX_COPIES) {
          errors.tooManyCopies = t("yugioh.errors.tooManyCopies", {
            name: card.name,
          });
        }
        break;
    }
  });

  return errors;
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
