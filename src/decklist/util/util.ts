import {
  handleAddToDeck as mtgAddToDeck,
  isInvalid as mtgIsInvalid,
} from "./mtg";
import {
  handleAddToDeck as pokemonAddToDeck,
  isInvalid as pokemonIsInvalid,
} from "./pokemon";
import {
  handleAddToDeck as ygoAddToDeck,
  isInvalid as ygoIsInvalid,
} from "./yugioh";

import { MTG_HAND_START_SIZE, MTG_NAME } from "./mtg";
import { POKEMON_HAND_START_SIZE, POKEMON_NAME } from "./pokemon";
import { YUGIOH_HAND_START_SIZE, YUGIOH_NAME } from "./yugioh";

import { Card, Deck, Game, mtgCard, pokemonCard, ygoCard } from "../../types";

export const isYugioh = (game: Game): boolean => {
  return game === YUGIOH_NAME;
};

export const isMTG = (game: Game): boolean => {
  return game === MTG_NAME;
};

export const isPokemon = (game: Game): boolean => {
  return game === POKEMON_NAME;
};

export const addToDeckHandlers: Record<Game, any> = {
  "Magic the Gathering": mtgAddToDeck,
  "Pokemon TCG": pokemonAddToDeck,
  Yugioh: ygoAddToDeck,
};

export const isInvalidHandlers: Record<Game, any> = {
  "Magic the Gathering": mtgIsInvalid,
  "Pokemon TCG": pokemonIsInvalid,
  Yugioh: ygoIsInvalid,
};

export const getCardHandSize = (game: Game) => {
  switch (game) {
    case YUGIOH_NAME:
      return YUGIOH_HAND_START_SIZE;
    case MTG_NAME:
      return MTG_HAND_START_SIZE;
    case POKEMON_NAME:
      return POKEMON_HAND_START_SIZE;
  }
};

export const getCard = (cardname: string, deck: Deck) => {
  return deck.find((c: Card) => {
    return c.name === cardname;
  });
};

export const getCardImage = (cardname: string, deck: Deck, game: Game) => {
  const card = getCard(cardname, deck);

  if (!card) {
    return null;
  }

  if (game === MTG_NAME) {
    return (card.details as mtgCard).image_uris.normal;
  } else if (game === YUGIOH_NAME) {
    return (card.details as ygoCard).card_images[0]?.image_url;
  } else if (game === POKEMON_NAME) {
    return (card.details as pokemonCard).images?.large;
  }
};
