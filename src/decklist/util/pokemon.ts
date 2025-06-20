import { setMainDeck } from "../../store/slices/uiSlice";

import { AppDispatch } from "../../store";
import { Card, Deck, mtgCard, pokemonCard } from "../../types";
import { binomial } from "./deckAnalytics";

export const POKEMON_NAME = "Pokemon TCG";

export const POKEMON_MIN_STAT = 10;

export const POKEMON_MAX_STAT = 500;

export const POKEMON_MIN_ATTACK_COST = 0;

export const POKEMON_MAX_ATTACK_COST = 5;

export const POKEMON_STAT_STEP = 10;

export const POKEMON_TYPES = [
  "Colorless",
  "Grass",
  "Fire",
  "Water",
  "Lightning",
  "Fighting",
  "Psychic",
  "Darkness",
  "Metal",
  "Dragon",
  "Fairy",
];

export const POKEMON_CARD_TYPES = ["Energy", "Pokémon", "Trainer"];

export const POKEMON_CARD_SUB_TYPES = [
  "BREAK",
  "Baby",
  "Basic",
  "EX",
  "GX",
  "Goldenrod Game Corner",
  "Item",
  "LEGEND",
  "Level-Up",
  "MEGA",
  "Pokémon Tool",
  "Pokémon Tool F",
  "Rapid Strike",
  "Restored",
  "Rocket's Secret Machine",
  "Single Strike",
  "Special",
  "Stadium",
  "Stage 1",
  "Stage 2",
  "Supporter",
  "TAG TEAM",
  "Technical Machine",
  "V",
  "VMAX",
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

export const isInvalid = (maindeck: Deck, _extradeck: Deck) => {
  const errors: any = {};

  const totalCards = maindeck.reduce((acc, card) => {
    acc += card.copies;
    return acc;
  }, 0);

  if (totalCards !== POKEMON_DECK_SIZE) {
    errors.wrongSize = "Decks must be 60 cards";
  }

  if (
    maindeck.some((card: Card) => {
      return card.copies > POKEMON_MAX_COPIES && !isEnergy(card);
    })
  ) {
    errors.tooManyCopies = `Decks cannot have more than 4 copies of a card`;
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
