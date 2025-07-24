import { render, screen } from "@testing-library/react";

import DisplayCard from "../../../decklist/components/mui/DisplayCard";

describe("DisplayCard", () => {
  it("renders children", () => {
    render(
      <DisplayCard>
        <div data-testid="child">test text</div>
      </DisplayCard>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("test text");
  });
});
