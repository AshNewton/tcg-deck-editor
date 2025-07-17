import {
  isYugioh,
  isMTG,
  isPokemon,
  includesIgnoreCase,
  isBetween,
  getCardHandSize,
  getCard,
  getCardImage,
  removeDuplicateCards,
} from "../../decklist/util/util";

import { MTG_NAME, MTG_HAND_START_SIZE } from "../../decklist/util/mtg";
import {
  POKEMON_NAME,
  POKEMON_HAND_START_SIZE,
} from "../../decklist/util/pokemon";
import {
  YUGIOH_NAME,
  YUGIOH_HAND_START_SIZE,
} from "../../decklist/util/yugioh";

import mtgDeckJson from "../../../testdata/otters.json";
import pokemonDeckJson from "../../../testdata/future - iron hands.json";
import yugiohDeckJson from "../../../testdata/branded.json";
import { Deck } from "../../types";

describe("general util functions", () => {
  describe("Game checkers", () => {
    test("isYugioh returns true for Yugioh", () => {
      expect(isYugioh("Yugioh")).toBe(true);
    });

    test("isMTG returns true for Magic", () => {
      expect(isMTG("Magic the Gathering")).toBe(true);
    });

    test("isPokemon returns true for Pokemon", () => {
      expect(isPokemon("Pokemon TCG")).toBe(true);
    });

    test("returns false when name doesnt match", () => {
      expect(isPokemon("Magic the Gathering")).toBe(false);
    });
  });

  describe("includesIgnoreCase", () => {
    test("returns true for matching strings ignoring case", () => {
      expect(includesIgnoreCase("hello", "HEL")).toBe(true);
    });

    test("returns true for same word", () => {
      expect(includesIgnoreCase("hello", "HeLlO")).toBe(true);
    });

    test("returns false for non-matching", () => {
      expect(includesIgnoreCase("hello", "xyz")).toBe(false);
    });
  });

  describe("isBetween", () => {
    test("returns true if number is between range", () => {
      expect(isBetween(5, [1, 10])).toBe(true);
    });

    test("returns false if number is out of range", () => {
      expect(isBetween(11, [1, 10])).toBe(false);
    });
  });

  describe("getCardHandSize", () => {
    test("returns correct hand size for each game", () => {
      expect(getCardHandSize(YUGIOH_NAME)).toBe(YUGIOH_HAND_START_SIZE);
      expect(getCardHandSize(MTG_NAME)).toBe(MTG_HAND_START_SIZE);
      expect(getCardHandSize(POKEMON_NAME)).toBe(POKEMON_HAND_START_SIZE);
    });
  });

  describe("getCard", () => {
    const deck = [{ name: "Pikachu", copies: 1 }] as any;
    test("returns card if found", () => {
      expect(getCard("Pikachu", deck)).toEqual(deck[0]);
    });

    test("returns undefined if card not found", () => {
      expect(getCard("Charizard", deck)).toBeUndefined();
    });
  });

  describe("getCardImage", () => {
    test("gets correct MTG card image", () => {
      expect(getCardImage("Island", mtgDeckJson.main as Deck, MTG_NAME)).toBe(
        "https://cards.scryfall.io/normal/front/1/f/1ff6acc9-581c-468f-894d-41f725da7f33.jpg?1743205101"
      );
    });

    test("gets correct Yugioh card image", () => {
      expect(
        getCardImage(
          "Fallen of Albaz",
          yugiohDeckJson.main as Deck,
          YUGIOH_NAME
        )
      ).toBe("https://images.ygoprodeck.com/images/cards/68468459.jpg");
    });

    test("gets correct Pokemon card image", () => {
      expect(
        getCardImage(
          "Iron Crown ex - Prismatic Evolutions",
          pokemonDeckJson.main as Deck,
          POKEMON_NAME
        )
      ).toBe("https://images.pokemontcg.io/sv8pt5/158_hires.png");
    });

    test("returns null if card not found", () => {
      expect(getCardImage("randomname", [], MTG_NAME)).toBeNull();
    });

    test("returns null if name blank", () => {
      expect(
        getCardImage("", pokemonDeckJson.main as Deck, MTG_NAME)
      ).toBeNull();
    });

    test("returns null if deck and game dont match", () => {
      expect(
        getCardImage("randomname", pokemonDeckJson.main as Deck, MTG_NAME)
      ).toBeNull();
    });
  });

  describe("removeDuplicateCards", () => {
    test("removes duplicate cards by name", () => {
      const cards = [
        { name: "A", copies: 1 },
        { name: "B", copies: 2 },
        { name: "A", copies: 3 },
      ] as any;
      const result = removeDuplicateCards(cards);
      expect(result).toEqual([
        { name: "A", copies: 1 },
        { name: "B", copies: 2 },
      ]);
    });
  });
});
