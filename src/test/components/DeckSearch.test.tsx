import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import DeckSearch from "../../decklist/components/DeckSearch";

import { useAppSelector, useAppDispatch } from "../../hooks";

import { Deck } from "../../types";

import mtgDeckJson from "../../../testdata/otters.json";
import yugiohDeckJson from "../../../testdata/branded.json";

jest.mock("../../hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Deck Search", () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;
  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders MTG deck search when game is MTG", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: [],
          extradeck: [],
        },
      });
    });

    render(<DeckSearch />);
    expect(screen.getByText("common.clear")).toBeInTheDocument();
    expect(screen.getByLabelText("search.filterByColor")).toBeInTheDocument();
  });

  it("filters and displays matching cards after form submit", async () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main,
          extradeck: [],
        },
      });
    });

    render(<DeckSearch />);
    fireEvent.click(screen.getByText("common.search")); //search should include every card

    await waitFor(() => expect(screen.getByText("Island")).toBeInTheDocument());
  });

  it("resets form and clears search results on clear click", async () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main,
          extradeck: [],
        },
      });
    });

    render(<DeckSearch />);
    fireEvent.click(screen.getByText("common.search")); //search should include every card

    await waitFor(() => expect(screen.getByText("Island")).toBeInTheDocument());

    fireEvent.click(screen.getByText("common.clear"));
    expect(screen.queryByText("Island")).not.toBeInTheDocument();
  });

  it("displays both main and extra results for Yugioh", async () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Yugioh",
          maindeck: yugiohDeckJson.main,
          extradeck: yugiohDeckJson.extra,
        },
      });
    });

    render(<DeckSearch />);

    fireEvent.click(screen.getByText("common.search")); //search should include every card

    await waitFor(() => {
      expect(screen.getByText("Fallen of Albaz")).toBeInTheDocument();
      expect(
        screen.getByText("Lubellion the Searing Dragon")
      ).toBeInTheDocument();
    });
  });
});
