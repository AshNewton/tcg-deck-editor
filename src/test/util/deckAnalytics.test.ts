import {
  binomial,
  getCardDraw,
  getChanceToOpenCards,
  getDeckSize,
  getStartingHand,
} from "../../decklist/util/deckAnalytics";

import { Deck } from "../../types";

// test data
const testDeck = [
  { name: "Card A", copies: 3, details: {} },
  { name: "Card B", copies: 2, details: {} },
  { name: "Card C", copies: 1, details: {} },
];

describe("deck analytics Utils", () => {
  describe("getDeckSize", () => {
    it("returns total number of cards in deck", () => {
      expect(getDeckSize(testDeck as Deck)).toBe(6);
    });
  });

  describe("getStartingHand", () => {
    it("returns correct number of cards", () => {
      expect(getDeckSize(testDeck as Deck)).toBe(6);
    });

    it("only includes cards from deck", () => {
      const validNames = testDeck.flatMap((card) =>
        Array(card.copies).fill(card.name)
      );
      const hand = getStartingHand(testDeck as Deck, 5);
      for (const card of hand) {
        expect(validNames).toContain(card);
      }
    });
  });

  describe("getCardDraw", () => {
    it("draws correct number of cards", () => {
      const hand = ["Card A", "Card A"];
      const draw = getCardDraw(testDeck as Deck, hand, 2);
      expect(draw.length).toBe(2);
    });

    it("never returns cards already in hand beyond deck limit", () => {
      const hand = ["Card A", "Card A", "Card A"];
      const draw = getCardDraw(testDeck as Deck, hand, 10);
      expect(draw).not.toContain("Card A");
    });
  });

  describe("binomial", () => {
    it("returns correct values", () => {
      expect(binomial(5, 2)).toBe(10);
      expect(binomial(10, 0)).toBe(1);
      expect(binomial(10, 10)).toBe(1);
      expect(binomial(10, 11)).toBe(0);
    });
  });

  describe("getChanceToOpenCards", () => {
    it("returns probabilities with correct names and format", () => {
      const result = getChanceToOpenCards(testDeck as Deck, 5);
      expect(result).toHaveLength(testDeck.length);

      result.forEach((entry, i) => {
        expect(entry.name).toBe(testDeck[i].name);
        expect(entry.chance).toMatch(/^\d+(\.\d{1,2})?%$/);
      });
    });
  });
});
