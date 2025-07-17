import {
  handleAddToDeck,
  isYgoCard,
  getBannedSeverity,
  getCardLevelName,
  isExtraDeckCard,
  isInvalid,
} from "../../decklist/util/yugioh";
import { setExtraDeck, setMainDeck } from "../../store/slices/uiSlice";

import { Card, Deck, ygoCard } from "../../types";

import yugiohDeckJson from "../../../testdata/branded.json";
import { getCard } from "../../decklist/util/util";
import { TFunction } from "i18next";

jest.mock("../../store/slices/uiSlice", () => ({
  setExtraDeck: jest.fn(() => ({ type: "ui/setExtraDeck", payload: [] })),
  setMainDeck: jest.fn(() => ({ type: "ui/setMainDeck", payload: [] })),
}));

const mockDispatch = jest.fn();

describe("yugioh util functions", () => {
  describe("isYgoCard", () => {
    it("returns true for valid ygoCard object", () => {
      expect(
        isYgoCard(
          getCard("Fallen of Albaz", yugiohDeckJson.main as Deck)?.details
        )
      ).toBe(true);
    });

    it("returns false for full Card object", () => {
      expect(
        isYgoCard(getCard("Fallen of Albaz", yugiohDeckJson.main as Deck))
      ).toBe(false);
    });

    it("returns false for invalid card", () => {
      expect(isYgoCard({ name: "Blue-Eyes" })).toBe(false);
      expect(isYgoCard("not an object")).toBe(false);
      expect(isYgoCard(undefined)).toBe(false);
    });
  });

  describe("getBannedSeverity", () => {
    it("returns correct severity", () => {
      expect(getBannedSeverity("Forbidden")).toBe("error");
      expect(getBannedSeverity("Limited")).toBe("warning");
      expect(getBannedSeverity("Semi-Limited")).toBe("warning");
      expect(getBannedSeverity(undefined)).toBe("success");
    });
  });

  describe("getCardLevelName", () => {
    it("returns 'Link Rating' for Link Monsters", () => {
      expect(getCardLevelName({ type: "Link Monster" } as ygoCard)).toBe(
        "Link Rating"
      );
    });

    it("returns 'Rank' for XYZ Monsters", () => {
      expect(getCardLevelName({ type: "XYZ Monster" } as ygoCard)).toBe("Rank");
    });

    it("returns 'Level' for all others", () => {
      expect(getCardLevelName({ type: "Normal Monster" } as ygoCard)).toBe(
        "Level"
      );
      expect(getCardLevelName({ type: "Synchro Monster" } as ygoCard)).toBe(
        "Level"
      );
      expect(getCardLevelName(null)).toBe("Level");
    });
  });

  describe("isExtraDeckCard", () => {
    const extraCard = (type: string) =>
      ({
        name: "Test",
        details: { type },
        copies: 1,
      } as Card);

    it("returns true for extra deck types", () => {
      expect(isExtraDeckCard(extraCard("Fusion Monster"))).toBe(true);
      expect(isExtraDeckCard(extraCard("XYZ Monster"))).toBe(true);
      expect(isExtraDeckCard(extraCard("Synchro Monster"))).toBe(true);
      expect(isExtraDeckCard(extraCard("Link Monster"))).toBe(true);
    });

    it("returns false for main deck types", () => {
      expect(isExtraDeckCard(extraCard("Normal Monster"))).toBe(false);
      expect(isExtraDeckCard(extraCard("Ritual Monster"))).toBe(false);
    });
  });

  describe("isInvalid", () => {
    const mockT = ((key: string, options?: any) => {
      if (options?.name) {
        return `${key} - ${options.name}`;
      }
      return key;
    }) as TFunction;

    it("returns error for too few cards", () => {
      const deck = [{ name: "A", copies: 10, details: {} }] as Card[];
      const errors = isInvalid(mockT, deck, []);
      expect(errors.tooSmall).toBe("yugioh.errors.tooSmall");
    });

    it("returns error for too many cards", () => {
      const deck = [{ name: "A", copies: 70, details: {} }] as Card[];
      const errors = isInvalid(mockT, deck, []);
      expect(errors.tooLarge).toBe("yugioh.errors.tooLarge");
    });

    it("returns error for too many extra deck cards", () => {
      const deck = [{ name: "A", copies: 45, details: {} }] as Card[];
      const extra = [{ name: "A", copies: 70, details: {} }] as Card[];

      const errors = isInvalid(mockT, deck, extra);
      expect(errors.tooLargeExtra).toBe("yugioh.errors.tooLargeExtra");
    });

    it("returns error for forbidden card", () => {
      const deck = [
        {
          name: "Pot of Greed",
          copies: 1,
          details: { banlist_info: { ban_tcg: "Forbidden" } },
        },
      ] as Card[];

      const errors = isInvalid(mockT, deck, []);
      expect(errors.forbidden).toBe("yugioh.errors.forbidden - Pot of Greed");
    });

    it("returns error for limited card", () => {
      const deck = [
        {
          name: "Pot of Greed",
          copies: 3,
          details: { banlist_info: { ban_tcg: "Limited" } },
        },
      ] as Card[];

      const errors = isInvalid(mockT, deck, []);
      expect(errors.limited).toBe("yugioh.errors.limited - Pot of Greed");
    });

    it("returns error for limited card", () => {
      const deck = [
        {
          name: "Pot of Greed",
          copies: 3,
          details: { banlist_info: { ban_tcg: "Semi-Limited" } },
        },
      ] as Card[];

      const errors = isInvalid(mockT, deck, []);
      expect(errors.semiLimited).toBe(
        "yugioh.errors.semiLimited - Pot of Greed"
      );
    });

    it("returns error for too many copies", () => {
      const deck = [{ name: "A", copies: 45, details: {} }] as Card[];
      const errors = isInvalid(mockT, deck, []);
      expect(errors.tooManyCopies).toBe("yugioh.errors.tooManyCopies - A");
    });

    it("returns empty object if valid", () => {
      const deck = Array.from({ length: 40 }, (_, i) => ({
        name: `Card ${i}`,
        copies: 1,
        details: {},
      })) as Card[];

      const errors = isInvalid(mockT, deck, []);
      expect(errors).toEqual({});
    });
  });

  describe("handleAddToDeck", () => {
    const baseCard = {
      name: "Dark Magician",
      details: { type: "Normal Monster" },
      copies: 1,
    } as Card;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("adds new card to main deck", () => {
      handleAddToDeck(baseCard, [], [], mockDispatch);
      expect(setMainDeck).toHaveBeenCalledWith([{ ...baseCard, copies: 1 }]);
    });

    it("adds to existing card copy in main deck", () => {
      const maindeck = [{ ...baseCard, copies: 1 }];
      handleAddToDeck(baseCard, maindeck, [], mockDispatch);
      expect(setMainDeck).toHaveBeenCalledWith([{ ...baseCard, copies: 2 }]);
    });

    it("adds new card to extra deck", () => {
      const linkCard = {
        name: "Decode Talker",
        details: { type: "Link Monster" },
      } as Card;

      handleAddToDeck(linkCard, [], [], mockDispatch);
      expect(setExtraDeck).toHaveBeenCalledWith([{ ...linkCard, copies: 1 }]);
    });
  });
});
