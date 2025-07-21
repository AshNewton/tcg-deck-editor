import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Decklist from "../../decklist/components/Decklist";

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
    t: (key: string, options?: any) =>
      options?.count != null ? `Cards: ${options.count}` : key,
  }),
}));

jest.mock("../../decklist/components/CardPreview", () => (props: any) => (
  <div data-testid={`card-${props.card.name}`}>
    {props.card.name}
    <button onClick={() => props.onAddCopy(props.card.name)}>+</button>
    <button onClick={() => props.onRemoveCopy(props.card.name)}>-</button>
    <button onClick={() => props.onDelete(props.card.name)}>X</button>
  </div>
));

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

  it("renders MtgDecklist when game is MTG", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main,
          extradeck: [],
        },
      });
    });

    render(
      <Decklist
        deckname="My MTG Deck"
        deck={mtgDeckJson.main as Deck}
        onDeckUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("My MTG Deck")).toBeInTheDocument();
    expect(screen.getByText("Island")).toBeInTheDocument();
  });

  it("renders MtgDecklist when game is MTG", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Yugioh",
          maindeck: yugiohDeckJson.main,
          extradeck: yugiohDeckJson.extra,
        },
      });
    });

    render(
      <Decklist
        deckname="My yugioh Deck"
        deck={yugiohDeckJson.main as Deck}
        onDeckUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("Fallen of Albaz")).toBeInTheDocument();
  });

  it("shows correct card count in header", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: mtgDeckJson.main,
          extradeck: [],
        },
      });
    });

    render(
      <Decklist
        deckname="My mtg Deck"
        deck={mtgDeckJson.main as Deck}
        onDeckUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("Cards: 60")).toBeInTheDocument();
  });

  it("removes, adds, and deletes cards properly", () => {
    const onDeckUpdate = jest.fn();
    const d = [
      {
        name: "Island",
        details: { type_line: "Basic Land — Island" },
        copies: 10,
      },
    ];

    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
          maindeck: d,
          extradeck: [],
        },
      });
    });

    render(
      <Decklist
        deckname="My mtg Deck"
        deck={d as Deck}
        onDeckUpdate={onDeckUpdate}
      />
    );

    const addBtn = screen
      .getByTestId("card-Island")
      .querySelector("button:nth-child(1)")!;
    const removeBtn = screen
      .getByTestId("card-Island")
      .querySelector("button:nth-child(2)")!;
    const deleteBtn = screen
      .getByTestId("card-Island")
      .querySelector("button:nth-child(3)")!;

    fireEvent.click(addBtn);
    expect(onDeckUpdate).toHaveBeenCalledWith([
      {
        name: "Island",
        details: { type_line: "Basic Land — Island" },
        copies: 11,
      },
    ]);

    fireEvent.click(removeBtn);
    expect(onDeckUpdate).toHaveBeenCalledWith([
      {
        name: "Island",
        details: { type_line: "Basic Land — Island" },
        copies: 9,
      },
    ]);

    fireEvent.click(deleteBtn);
    expect(onDeckUpdate).toHaveBeenCalledWith([]);
  });
});
