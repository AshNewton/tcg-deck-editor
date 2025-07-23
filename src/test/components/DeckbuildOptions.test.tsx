import { render, screen } from "@testing-library/react";

import DeckbuildOptions from "../../decklist/components/DeckbuildOptions";

import { useAppDispatch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
  useDebounce: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options?.count != null ? `Cards: ${options.count}` : key,
  }),
}));

describe("Deckbuild Details", () => {
  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders search bar and save/load controls", () => {
    render(<DeckbuildOptions />);

    expect(screen.getByText("common.save")).toBeInTheDocument();
    expect(screen.getByText("common.load")).toBeInTheDocument();
  });
});
