import { render, screen, fireEvent } from "@testing-library/react";

import Button from "../../../decklist/components/mui/Button";

describe("Button", () => {
  it("renders with the correct text", () => {
    render(<Button text="Click me" />);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button text="Submit" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("passes through props like disabled", () => {
    render(<Button text="Disabled" disabled />);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
  });
});
