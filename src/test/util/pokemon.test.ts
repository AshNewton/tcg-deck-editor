import {
  getEnergyProbabilities,
  handleAddToDeck,
  isInvalid,
} from "../../decklist/util/pokemon";
import { setMainDeck } from "../../store/slices/uiSlice";

import { Card, Deck } from "../../types";

jest.mock("../../store/slices/uiSlice", () => ({
  setMainDeck: jest.fn(() => ({ type: "ui/setMainDeck", payload: [] })),
}));

describe("pokemon util functions", () => {
  const mockT = ((key: string) => key) as any;

  const makeCard = (
    name: string,
    supertype = "Pokémon",
    isEnergy = false,
    copies = 1
  ): Card => ({
    name,
    copies: copies,
    details: {
      name,
      supertype: isEnergy ? "Energy" : supertype,
      subtypes: ["Basic", "ex", "Future"],
      id: "1234",
      set: {
        id: "sv8pt5",
        name: "Prismatic Evolutions",
        series: "Scarlet & Violet",
        printedTotal: 131,
        total: 180,
        legalities: {
          unlimited: "Legal",
          standard: "Legal",
          expanded: "Legal",
        },
        ptcgoCode: "PRE",
        releaseDate: "2025/01/17",
        updatedAt: "025/01/16 22:00:00",
        images: {
          symbol: "https://images.pokemontcg.io/sv8pt5/symbol.png",
          logo: "https://images.pokemontcg.io/sv8pt5/logo.png",
        },
      },
      number: "42",
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      images: {
        small: "https://images.pokemontcg.io/sv8pt5/158.png",
        large: "https://images.pokemontcg.io/sv8pt5/158_hires.png",
      },
    },
  });

  describe("isInvalid", () => {
    it("should return error if deck is wrong size", () => {
      const deck: Deck = Array(58).fill(makeCard("Pikachu"));
      const errors = isInvalid(mockT, deck, []);
      expect(errors).toHaveProperty("wrongSize");
    });

    it("should return error if deck has too many copies of a non-energy card", () => {
      const card = makeCard("Pikachu");
      card.copies = 5;
      const deck: Deck = Array(59).fill(makeCard("Bulbasaur"));
      deck.push(card);
      const errors = isInvalid(mockT, deck, []);
      expect(errors).toHaveProperty("tooManyCopies");
    });

    it("should allow more than 4 copies of Energy cards", () => {
      const energyCard = makeCard("Lightning Energy", "Basic Energy", true, 10);
      const deck: Deck = [energyCard];
      deck[0].copies = 10; // 50 single-copy cards + 10 energies = 60
      const errors = isInvalid(mockT, deck, []);
      expect(errors).not.toHaveProperty("tooManyCopies");
    });

    it("should return no error for valid deck", () => {
      const card = makeCard("Charmander");
      const deck: Deck = Array(60).fill(card);
      const errors = isInvalid(mockT, deck, []);
      expect(errors).toEqual({});
    });
  });

  describe("handleAddToDeck", () => {
    const dispatch = jest.fn();

    it("should add a new card to deck", () => {
      const card = makeCard("Pikachu");
      const maindeck: Deck = [];
      handleAddToDeck(card, maindeck, [], dispatch);
      expect(setMainDeck).toHaveBeenCalledWith([{ ...card, copies: 1 }]);
    });

    it("should increment copies if card already exists", () => {
      const card = makeCard("Charmander");
      const maindeck: Deck = [{ ...card, copies: 2 }];
      handleAddToDeck(card, maindeck, [], dispatch);
      expect(setMainDeck).toHaveBeenCalledWith([{ ...card, copies: 3 }]);
    });

    it("should return original deck if card is falsy", () => {
      const maindeck: Deck = [makeCard("Squirtle")];
      handleAddToDeck(null as any, maindeck, [], dispatch);
      expect(setMainDeck).toHaveBeenCalledWith(maindeck);
    });
  });

  describe("getEnergyProbabilities", () => {
    it("should return an array of probabilities that sum to ~100", () => {
      const energyCard = makeCard("Energy", "Energy", true);
      energyCard.copies = 20;
      const deck: Deck = [...Array(40).fill(makeCard("Bulbasaur")), energyCard];
      deck[0].copies = 20; // make total = 60
      const probs = getEnergyProbabilities(deck);
      expect(probs).toHaveLength(8); // k = 0 to 7 inclusive
      const sum = probs.reduce((acc, val) => acc + val, 0);
      expect(sum).toBeGreaterThanOrEqual(99);
      expect(sum).toBeLessThanOrEqual(101);
    });
  });
});
