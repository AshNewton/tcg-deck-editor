import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import Header from "../../decklist/header/Header";

import * as reduxHooks from "../../hooks";
import { setGame, setMenu } from "../../store/slices/uiSlice";

jest.mock("../../hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

describe("Header", () => {
  const useAppSelectorMock = reduxHooks.useAppSelector as jest.Mock;
  const useAppDispatchMock = reduxHooks.useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the select with correct value", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Pokemon TCG",
        },
      });
    });

    const { container } = render(<Header />);
    const select = container.querySelector("#header-game-select");

    expect(select).toBeInTheDocument();

    const img = select?.querySelector("img");
    expect(img).toHaveAttribute("title", "Pokemon TCG");
  });

  it("dispatches setGame when selection changes", () => {
    // set up
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Pokemon TCG",
        },
      });
    });

    // get game select
    const { container } = render(<Header />);
    const select = container.querySelector("#header-game-select");
    expect(select).toBeInTheDocument();

    // open game select
    select && fireEvent.mouseDown(select);

    screen.debug();

    // click another option
    const newGameOption = screen.getByRole("option", { name: "Yugioh" });
    expect(newGameOption).toBeInTheDocument();
    newGameOption && fireEvent.click(newGameOption);

    // dispatch should have been called
    expect(dispatchMock).toHaveBeenCalledWith(setGame("Yugioh"));
  });

  it("renders menu items and clicking dispatches setMenu", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
        },
      });
    });

    render(React.createElement(Header));
    const button = screen.getByText("menu.startingHand");
    fireEvent.click(button);

    expect(dispatchMock).toHaveBeenCalledWith(setMenu("Starting Hand"));
  });

  it("does not render 'Color Breakdown' menu item if game is not mtg", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Yugioh",
        },
      });
    });

    render(React.createElement(Header));
    expect(screen.queryByText("menu.colorBreakdown")).toBeNull();
  });

  it("renders 'Color Breakdown' menu item if game is mtg", () => {
    useAppSelectorMock.mockImplementation((selectorFn) => {
      return selectorFn({
        ui: {
          game: "Magic the Gathering",
        },
      });
    });

    render(React.createElement(Header));
    expect(screen.getByText("menu.colorBreakdown")).toBeInTheDocument();
  });
});
