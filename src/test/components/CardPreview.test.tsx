import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import CardPreview from "../../decklist/components/CardPreview";

import { getCard } from "../../decklist/util/util";
import { useAppSelector, useAppDispatch } from "../../hooks";

import { Card, Deck } from "../../types";

import mtgDeckJson from "../../../testdata/otters.json";
import pokemonDeckJson from "../../../testdata/future - iron hands.json";

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

describe("Card Preview", () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;
  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders card name and copies", () => {
    const card = getCard("Island", mtgDeckJson.main as Deck) as Card;
    const onDelete = jest.fn();
    const onAddCopy = jest.fn();
    const onRemoveCopy = jest.fn();

    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
        },
      });
    });

    render(
      <CardPreview
        card={card}
        onDelete={onDelete}
        onAddCopy={onAddCopy}
        onRemoveCopy={onRemoveCopy}
      />
    );

    expect(screen.getByText(card.name)).toBeInTheDocument();
    expect(screen.getByText(card.copies)).toBeInTheDocument();
  });

  it("calls onDelete, onRemoveCopy, and onAddCopy when buttons clicked", () => {
    const card = getCard("Island", mtgDeckJson.main as Deck) as Card;
    const onDelete = jest.fn();
    const onAddCopy = jest.fn();
    const onRemoveCopy = jest.fn();

    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
        },
      });
    });

    render(
      <CardPreview
        card={card}
        onDelete={onDelete}
        onAddCopy={onAddCopy}
        onRemoveCopy={onRemoveCopy}
      />
    );

    fireEvent.click(screen.getByLabelText("delete"));
    expect(onDelete).toHaveBeenCalledWith("Island");

    fireEvent.click(screen.getByLabelText("remove copy"));
    expect(onRemoveCopy).toHaveBeenCalledWith("Island");

    fireEvent.click(screen.getByLabelText("add copy"));
    expect(onAddCopy).toHaveBeenCalledWith("Island");
  });

  it("disables add button when copies are at max and not basic land or energy", () => {
    const card = getCard("Refute", mtgDeckJson.main as Deck) as Card;

    const onDelete = jest.fn();
    const onAddCopy = jest.fn();
    const onRemoveCopy = jest.fn();

    // non basic land/energy should be disabled
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
        },
      });
    });

    render(
      <CardPreview
        card={card}
        onDelete={onDelete}
        onAddCopy={onAddCopy}
        onRemoveCopy={onRemoveCopy}
      />
    );

    expect(screen.getByLabelText("add copy")).toBeDisabled();
  });

  it("basic land not disabled when over normal max copies", () => {
    const land = getCard("Island", mtgDeckJson.main as Deck) as Card;

    const onDelete = jest.fn();
    const onAddCopy = jest.fn();
    const onRemoveCopy = jest.fn();

    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
        },
      });
    });

    render(
      <CardPreview
        card={land}
        onDelete={onDelete}
        onAddCopy={onAddCopy}
        onRemoveCopy={onRemoveCopy}
      />
    );

    expect(screen.getByLabelText("add copy")).not.toBeDisabled();
  });

  it("basic energy  not disabled when over normal max copies", () => {
    const land = getCard(
      "Basic Lightning Energy - Scarlet & Violet",
      pokemonDeckJson.main as Deck
    ) as Card;

    const onDelete = jest.fn();
    const onAddCopy = jest.fn();
    const onRemoveCopy = jest.fn();

    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Pokemon TCG",
        },
      });
    });

    render(
      <CardPreview
        card={land}
        onDelete={onDelete}
        onAddCopy={onAddCopy}
        onRemoveCopy={onRemoveCopy}
      />
    );

    expect(screen.getByLabelText("add copy")).not.toBeDisabled();
  });
});
