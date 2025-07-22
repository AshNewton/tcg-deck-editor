import { render, screen } from "@testing-library/react";

import CardDetails from "../../decklist/components/CardDetails";

import { getCard } from "../../decklist/util/util";
import { useAppSelector, useAppDispatch } from "../../hooks";

import { Deck } from "../../types";

import mtgDeckJson from "../../../testdata/otters.json";
import pokemonDeckJson from "../../../testdata/future - iron hands.json";
import yugiohDeckJson from "../../../testdata/branded.json";

jest.mock("../../hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock("../../decklist/components/mtg/CardDetails", () => (props: any) => (
  <div data-testid="mtg-details">{props.card.name}</div>
));
jest.mock(
  "../../decklist/components/pokemon/CardDetails",
  () => (props: any) =>
    <div data-testid="pokemon-details">{props.card.name}</div>
);
jest.mock(
  "../../decklist/components/yugioh/CardDetails",
  () => (props: any) =>
    <div data-testid="yugioh-details">{props.card.name}</div>
);

describe("Card Details", () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;
  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing if no card is selected", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          selectedCard: null,
        },
      });
    });

    const { container } = render(<CardDetails />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders MtgCardDetails when game is MTG", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          selectedCard: getCard("Island", mtgDeckJson.main as Deck),
        },
      });
    });

    render(<CardDetails />);

    expect(screen.getByTestId("mtg-details")).toHaveTextContent("Island");
  });

  it("renders PokemonCardDetails when game is Pokemon", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Pokemon TCG",
          selectedCard: getCard(
            "Iron Hands ex - Paradox Rift",
            pokemonDeckJson.main as Deck
          ),
        },
      });
    });

    render(<CardDetails />);

    expect(screen.getByTestId("pokemon-details")).toHaveTextContent(
      "Iron Hands ex - Paradox Rift"
    );
  });

  it("renders PokemonCardDetails when game is Pokemon", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Yugioh",
          selectedCard: getCard("Fallen of Albaz", yugiohDeckJson.main as Deck),
        },
      });
    });

    render(<CardDetails />);

    expect(screen.getByTestId("yugioh-details")).toHaveTextContent(
      "Fallen of Albaz"
    );
  });
});
