import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import StartingHand from "../../decklist/components/StartingHand";

import * as reduxHooks from "../../hooks";
import { setGame, setMenu } from "../../store/slices/uiSlice";

import { MTG_HAND_START_SIZE } from "../../decklist/util/mtg";

import { Deck } from "../../types";

import mtgDeckJson from "../../../testdata/otters.json";
import pokemonDeckJson from "../../../testdata/future - iron hands.json";

jest.mock("../../hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Starting Hand", () => {
  const useAppSelectorMock = reduxHooks.useAppSelector as jest.Mock;
  const useAppDispatchMock = reduxHooks.useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: [],
          extradeck: [],
        },
      });
    });

    render(<StartingHand />);
    expect(screen.getByText("startingHand.sampleHand")).toBeInTheDocument();
  });

  it("generates a starting hand on expand", async () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main as Deck,
          extradeck: [],
        },
      });
    });

    render(<StartingHand />);
    fireEvent.click(screen.getByText("startingHand.sampleHand"));
    await waitFor(() =>
      expect(screen.getAllByRole("img").length).toBe(MTG_HAND_START_SIZE)
    );
  });

  it("draws a card when draw button clicked", async () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main as Deck,
          extradeck: [],
        },
      });
    });

    render(<StartingHand />);
    fireEvent.click(screen.getByText("startingHand.sampleHand"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("startingHand.draw"));
    });
    expect(screen.getAllByRole("img").length).toBe(MTG_HAND_START_SIZE + 1);
  });

  it("shows probability text", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main as Deck,
          extradeck: [],
        },
      });
    });

    render(<StartingHand />);
    expect(screen.getByText("startingHand.probability")).toBeInTheDocument();
  });

  it("shows numberLands section if game is MTG", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main as Deck,
          extradeck: [],
        },
      });
    });

    render(<StartingHand />);
    expect(screen.getByText("startingHand.numberLands")).toBeInTheDocument();
  });

  it("doesnt show numberLands section if game isnt MTG", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Pokemon",
          maindeck: pokemonDeckJson.main as Deck,
          extradeck: [],
        },
      });
    });

    render(<StartingHand />);
    expect(
      screen.queryByText("startingHand.numberLands")
    ).not.toBeInTheDocument();
  });
});
