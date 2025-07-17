import {
  isInvalid,
  handleAddToDeck,
  getLandProbabilities,
} from "../../decklist/util/mtg";
import { setMainDeck } from "../../store/slices/uiSlice";

import { Card, Deck, mtgCard } from "../../types";

jest.mock("../../store/slices/uiSlice", () => ({
  setMainDeck: jest.fn(),
}));

describe("MTG Deck Utils", () => {
  const mockT = ((key: string) => key) as any;

  const makeCard = (
    name: string,
    typeLine = "Creature — Elf",
    copies = 1
  ): Card => ({
    name,
    copies: copies,
    details: {
      name,
      type_line: typeLine,
    } as mtgCard,
  });

  describe("isInvalid", () => {
    it("returns error if deck has fewer than 60 cards", () => {
      const deck: Deck = Array(58).fill(makeCard("Llanowar Elves"));
      const errors = isInvalid(mockT, deck, []);
      expect(errors).toHaveProperty("tooSmall");
    });

    it("returns error if deck has >4 copies of non-Basic Land", () => {
      const card = makeCard("Lightning Bolt");
      card.copies = 5;
      const deck: Deck = Array(59).fill(makeCard("Forest", "Basic Land"));
      deck.push(card);
      const errors = isInvalid(mockT, deck, []);
      expect(errors).toHaveProperty("tooManyCopies");
    });

    it("allows more than 4 copies of Basic Land", () => {
      const land = makeCard("Plains", "Basic Land", 15);
      const deck: Deck = [land];
      const errors = isInvalid(mockT, deck, []);
      expect(errors).not.toHaveProperty("tooManyCopies");
    });

    it("returns no errors for valid deck", () => {
      const deck: Deck = Array(60).fill(makeCard("Grizzly Bears"));
      const errors = isInvalid(mockT, deck, []);
      expect(errors).toEqual({});
    });
  });

  describe("handleAddToDeck", () => {
    const dispatch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("adds new card to deck with one copy", () => {
      const deck: Deck = [];
      const card = makeCard("Shivan Dragon");
      handleAddToDeck(card, deck, [], dispatch);
      expect(setMainDeck).toHaveBeenCalledWith([{ ...card, copies: 1 }]);
    });

    it("increments copies of existing card", () => {
      const card = makeCard("Llanowar Elves");
      const deck: Deck = [{ ...card, copies: 2 }];
      handleAddToDeck(card, deck, [], dispatch);
      expect(setMainDeck).toHaveBeenCalledWith([{ ...card, copies: 3 }]);
    });

    it("returns original deck if card is falsy", () => {
      const deck: Deck = [makeCard("Forest", "Basic Land")];
      handleAddToDeck(null as any, deck, [], dispatch);
      expect(setMainDeck).toHaveBeenCalledWith(deck);
    });
  });

  describe("getLandProbabilities", () => {
    it("returns array of probabilities summing to ~100", () => {
      const land = makeCard("Swamp", "Basic Land");
      land.copies = 24;
      const deck: Deck = [...Array(36).fill(makeCard("Doom Blade")), land];
      deck[0].copies = 36;

      const probs = getLandProbabilities(deck);
      expect(probs).toHaveLength(8);
      const sum = probs.reduce((a, b) => a + b, 0);
      expect(sum).toBeGreaterThanOrEqual(99);
      expect(sum).toBeLessThanOrEqual(101);
    });
  });
});
