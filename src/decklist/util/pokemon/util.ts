import { setMainDeck } from "../../../store/slices/uiSlice";

import { AppDispatch } from "../../../store";
import { Card, Deck, pokemonCard } from "../../../types";
import { binomial } from "./../deckAnalytics";

import { POKEMON_DECK_SIZE, POKEMON_HAND_START_SIZE, POKEMON_MAX_COPIES } from "./constants";

import { TFunction } from "i18next";

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