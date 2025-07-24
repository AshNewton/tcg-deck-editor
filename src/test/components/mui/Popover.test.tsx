import { render, screen } from "@testing-library/react";

import Popover from "../../../decklist/components/mui/Popover";

import { PopoverPosition } from "@mui/material/Popover";

describe("Popover", () => {
  const anchorPos: PopoverPosition = { top: 100, left: 200 };

  it("does not render when anchorPos is undefined", () => {
    const { queryByRole } = render(
      <Popover anchorPos={undefined}>Content</Popover>
    );
    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("renders children when anchorPos is set", () => {
    render(<Popover anchorPos={anchorPos}>text in popover</Popover>);
    expect(screen.getByText("text in popover")).toBeInTheDocument();
  });
});
