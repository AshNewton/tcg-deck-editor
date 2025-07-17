import { setMainDeck } from "../../store/slices/uiSlice";

import { AppDispatch } from "../../store";
import { Card, Deck, pokemonCard } from "../../types";
import { binomial } from "./deckAnalytics";

import { TFunction } from "i18next";

export const POKEMON_NAME = "Pokemon TCG";

export const POKEMON_MIN_STAT = 10;

export const POKEMON_MAX_STAT = 500;

export const POKEMON_MIN_ATTACK_COST = 0;

export const POKEMON_MAX_ATTACK_COST = 5;

export const POKEMON_STAT_STEP = 10;

export const POKEMON_TYPES = [
  "pokemon.typeList.colorless",
  "pokemon.typeList.grass",
  "pokemon.typeList.fire",
  "pokemon.typeList.water",
  "pokemon.typeList.lightning",
  "pokemon.typeList.fighting",
  "pokemon.typeList.psychic",
  "pokemon.typeList.darkness",
  "pokemon.typeList.metal",
  "pokemon.typeList.dragon",
  "pokemon.typeList.fairy",
];

export const POKEMON_TYPES_LABELS: Record<string, string> = {
  "pokemon.typeList.colorless": "Colorless",
  "pokemon.typeList.grass": "Grass",
  "pokemon.typeList.fire": "Fire",
  "pokemon.typeList.water": "Water",
  "pokemon.typeList.lightning": "Lightning",
  "pokemon.typeList.fighting": "Fighting",
  "pokemon.typeList.psychic": "Psychic",
  "pokemon.typeList.darkness": "Darkness",
  "pokemon.typeList.metal": "Metal",
  "pokemon.typeList.dragon": "Dragon",
  "pokemon.typeList.fairy": "Fairy",
};

export const POKEMON_CARD_TYPES = [
  "pokemon.cardTypes.energy",
  "pokemon.cardTypes.pokemon",
  "pokemon.cardTypes.trainer",
];

export const POKEMON_CARD_SUB_TYPES = [
  "pokemon.subTypeList.break",
  "pokemon.subTypeList.baby",
  "pokemon.subTypeList.basic",
  "pokemon.subTypeList.ex",
  "pokemon.subTypeList.gx",
  "pokemon.subTypeList.goldenRodGameCorner",
  "pokemon.subTypeList.item",
  "pokemon.subTypeList.legend",
  "pokemon.subTypeList.levelUp",
  "pokemon.subTypeList.mega",
  "pokemon.subTypeList.tool",
  "pokemon.subTypeList.toolF",
  "pokemon.subTypeList.rapidStrike",
  "pokemon.subTypeList.restored",
  "pokemon.subTypeList.reocketsSecretMachine",
  "pokemon.subTypeList.singleStrike",
  "pokemon.subTypeList.special",
  "pokemon.subTypeList.stadium",
  "pokemon.subTypeList.stage1",
  "pokemon.subTypeList.stage2",
  "pokemon.subTypeList.supporter",
  "pokemon.subTypeList.tagTeam",
  "pokemon.subTypeList.tm",
  "pokemon.subTypeList.v",
  "pokemon.subTypeList.vmax",
];

export const POKEMON_HAND_START_SIZE = 7;

export const POKEMON_MAX_COPIES = 4;

export const POKEMON_DECK_SIZE = 60;

export const isPokemonCard = (card: any): card is pokemonCard => {
  return (
    typeof card === "object" &&
    typeof card.name === "string" &&
    typeof card.supertype === "string" &&
    typeof card.subtypes === "object"
  );
};

export const isEnergy = (card: Card): boolean => {
  return (
    isPokemonCard(card.details) &&
    (card.details as pokemonCard)?.supertype?.includes("Energy")
  );
};

export const isInvalid = (t: TFunction, maindeck: Deck, _extradeck: Deck) => {
  const errors: any = {};

  const totalCards = maindeck.reduce((acc, card) => {
    acc += card.copies;
    return acc;
  }, 0);

  if (totalCards !== POKEMON_DECK_SIZE) {
    errors.wrongSize = t("pokemon.errors.wrongSize");
  }

  if (
    maindeck.some((card: Card) => {
      return card.copies > POKEMON_MAX_COPIES && !isEnergy(card);
    })
  ) {
    errors.tooManyCopies = t("mtg.errors.tooManyCopies");
  }

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
    return;
  }

  // if card is already in deck, add a copy
  if (maindeck.find((card) => card.name === newCard.name)) {
    const updatedDeck = maindeck.map((card) =>
      card.name === newCard.name ? { ...card, copies: card.copies + 1 } : card
    );

    dispatch(setMainDeck(updatedDeck));
  } else {
    // card not already in deck, add it to deck with one copy
    dispatch(setMainDeck([...maindeck, { ...newCard, copies: 1 }]));
  }
};

export const getEnergyProbabilities = (deck: Deck) => {
  const totalCards = deck.reduce((sum, card) => sum + card.copies, 0);

  const totalEnergy = deck
    .filter((card) => isEnergy(card))
    .reduce((sum, card) => sum + card.copies, 0);

  const probabilities: number[] = [];

  for (let k = 0; k <= POKEMON_HAND_START_SIZE; k++) {
    const p =
      (binomial(totalEnergy, k) *
        binomial(totalCards - totalEnergy, POKEMON_HAND_START_SIZE - k)) /
      binomial(totalCards, POKEMON_HAND_START_SIZE);
    probabilities.push(Number((p * 100).toPrecision(4)));
  }

  return probabilities;
};
