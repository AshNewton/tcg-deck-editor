import { render, screen } from "@testing-library/react";

import TextWithSymbols from "../../../decklist/components/mui/TextWithSymbols";

import { MtgSymbol } from "../../../types";

const symbols: MtgSymbol[] = [
  { symbol: "{W}", url: "/symbols/W.svg", alt: "White Mana" },
  { symbol: "{U}", url: "/symbols/U.svg", alt: "Blue Mana" },
  { symbol: "{WU}", url: "/symbols/WU.svg", alt: "White or Blue Mana" },
];

describe("TextWithSymbols", () => {
  it("renders text with no symbols", () => {
    render(<TextWithSymbols text="no symbols" symbols={symbols} />);
    expect(screen.getByText("no symbols")).toBeInTheDocument();
  });

  it("renders a symbol as an image", () => {
    render(<TextWithSymbols text="Cost: {W}" symbols={symbols} />);
    expect(screen.getByText("Cost:")).toBeInTheDocument();
    const img = screen.getByRole("img", { name: "White Mana" });
    expect(img).toHaveAttribute("src", "/symbols/W.svg");
    expect(img).toHaveAttribute("alt", "White Mana");
    expect(img).toHaveAttribute("title", "White Mana");
  });

  it("renders multiple symbols", () => {
    render(<TextWithSymbols text="{W}{U}" symbols={symbols} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "White Mana");
    expect(images[1]).toHaveAttribute("alt", "Blue Mana");
  });

  it("renders mixed text and symbols", () => {
    render(<TextWithSymbols text="Pay {W} or {U}." symbols={symbols} />);
    expect(screen.getByText("Pay")).toBeInTheDocument();
    expect(screen.getByText("or")).toBeInTheDocument();
    expect(screen.getByText(".")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
});
