import { render, screen } from "@testing-library/react";

import Text from "../../../decklist/components/mui/Text";

describe("Text component", () => {
  it("renders text when noWrap is false", () => {
    render(<Text text="some text" />);
    expect(screen.getByText("some text")).toBeInTheDocument();
  });

  it("renders numeric text", () => {
    render(<Text text={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders wrapped in tooltip when noWrap is true", () => {
    render(<Text text="tooltip text" noWrap />);
    const tooltipTrigger = screen.getByText("tooltip text");
    expect(tooltipTrigger).toBeInTheDocument();
    expect(
      tooltipTrigger.closest("div[role='tooltip']")
    ).not.toBeInTheDocument();
  });

  it("applies custom fontSize", () => {
    render(<Text text="bigger text" fontSize={24} />);
    const el = screen.getByText("bigger text");
    expect(el).toHaveStyle("font-size: 24px");
  });

  it("passes through extra props", () => {
    render(<Text text="Extra prop" data-testid="custom-text" />);
    expect(screen.getByTestId("custom-text")).toHaveTextContent("Extra prop");
  });
});
