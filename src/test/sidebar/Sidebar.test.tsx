import React from "react";
import { render, screen } from "@testing-library/react";

import Sidebar from "../../decklist/sidebar/Sidebar";

import * as reduxHooks from "../../hooks";

jest.mock("../../hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock(
  "../../decklist/components/DeckbuildOptions",

  () => () => {
    const React = require("react");
    return React.createElement("div", { "data-testid": "DeckbuildOptions" });
  }
);
jest.mock(
  "../../decklist/components/Decklist",
  () =>
    ({ deckname }: { deckname: string }) => {
      const React = require("react");
      return React.createElement("div", {
        "data-testid": `Decklist-${deckname}`,
      });
    }
);

describe("Sidebar", () => {
  const useAppSelectorMock = reduxHooks.useAppSelector as jest.Mock;
  const useAppDispatchMock = reduxHooks.useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows helper text when both decks are empty", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          maindeck: [],
          extradeck: [],
          game: "Yugioh",
        },
      });
    });

    render(React.createElement(Sidebar));

    expect(screen.getByText("helperText.noCards")).toBeInTheDocument();
  });

  it("renders decklists and shows validation warnings", () => {
    useAppSelectorMock.mockImplementation((selectorFn) =>
      selectorFn({
        ui: {
          maindeck: [{ name: "Card A", copies: 3 }],
          extradeck: [{ name: "Card X", copies: 1 }],
          game: "Yugioh",
        },
      })
    );

    render(React.createElement(Sidebar));

    expect(screen.getByText("yugioh.errors.tooSmall")).toBeInTheDocument();
    expect(screen.getByTestId("Decklist-yugioh.mainDeck")).toBeInTheDocument();
    expect(screen.getByTestId("Decklist-yugioh.extraDeck")).toBeInTheDocument();
  });

  it("renders one decklist only when not yugioh", () => {
    useAppSelectorMock.mockImplementation((selectorFn) =>
      selectorFn({
        ui: {
          maindeck: [{ name: "Card A", copies: 3 }],
          extradeck: [],
          game: "Magic the Gathering",
        },
      })
    );

    render(React.createElement(Sidebar));

    expect(screen.getByTestId("Decklist-common.deck")).toBeInTheDocument();
    expect(
      screen.queryByTestId("Decklist-yugioh.extraDeck")
    ).not.toBeInTheDocument();
  });
});
