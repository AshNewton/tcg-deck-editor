import React from "react";
import { render, screen } from "@testing-library/react";

import Body from "../../decklist/body/Body";

import * as reduxHooks from "../../hooks";

jest.mock("../../hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock("../../decklist/components/DeckSearch", () => () => {
  const React = require("react");
  return React.createElement("div", {
    "data-testid": "DeckSearch",
  });
});
jest.mock("../../decklist/components/StartingHand", () => () => {
  const React = require("react");
  return React.createElement("div", {
    "data-testid": "StartingHand",
  });
});
jest.mock("../../decklist/components/mtg/Mana", () => () => {
  const React = require("react");
  return React.createElement("div", {
    "data-testid": "Mana",
  });
});

describe("Body", () => {
  const useAppSelectorMock = reduxHooks.useAppSelector as jest.Mock;
  const useAppDispatchMock = reduxHooks.useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows correct component for menu values ", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          menu: "Starting Hand",
        },
      });
    });
    render(React.createElement(Body));
    expect(screen.getByTestId("StartingHand")).toBeInTheDocument();

    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          menu: "Color Breakdown",
        },
      });
    });
    render(React.createElement(Body));
    expect(screen.getByTestId("Mana")).toBeInTheDocument();
  });
});
