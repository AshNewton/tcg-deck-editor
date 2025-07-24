import { render, screen } from "@testing-library/react";

import ExternalLink from "../../../decklist/components/mui/ExternalLink";

describe("ExternalLink", () => {
  it("renders with correct label and href", () => {
    render(<ExternalLink href="https://example.com" label="Example Site" />);

    const link = screen.getByRole("link", { name: "Example Site" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("has correct security attributes", () => {
    render(<ExternalLink href="https://example.com" label="Example" />);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("passes additional props", () => {
    render(
      <ExternalLink
        href="https://example.com"
        label="Example"
        data-testid="custom-link"
        className="custom-class"
      />
    );

    const link = screen.getByTestId("custom-link");
    expect(link).toHaveClass("custom-class");
  });
});
