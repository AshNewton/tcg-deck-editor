import { setExtraDeck, setMainDeck } from "../../../store/slices/uiSlice";

import { AlertProps } from "@mui/material";
import { AppDispatch } from "../../../store";
import { BanType, Card, Deck, ygoCard } from "../../../types";

import { TFunction } from "i18next";
import { YUGIOH_MAX_COPIES } from "./constants";

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