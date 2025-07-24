import { render, screen } from "@testing-library/react";

import PopoverList from "../../../decklist/components/mui/PopoverList";

import { PopoverPosition } from "@mui/material/Popover";

describe("PopoverList", () => {
  const anchorPos: PopoverPosition = { top: 100, left: 200 };

  const list = [
    { name: "One", value: 1 },
    { name: "Two", value: 2 },
  ];

  const formatText = (item: any) => `${item.name}: ${item.value}`;

  it("renders nothing when anchorPos is null", () => {
    const { container } = render(
      <PopoverList
        list={list}
        anchorPos={null}
        handleClose={jest.fn()}
        formatText={formatText}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders list items in popover when anchorPos is set", () => {
    render(
      <PopoverList
        list={list}
        anchorPos={anchorPos}
        handleClose={jest.fn()}
        formatText={formatText}
      />
    );

    expect(screen.getByText("One: 1")).toBeInTheDocument();
    expect(screen.getByText("Two: 2")).toBeInTheDocument();
  });

  it("calls formatText for each item", () => {
    const formatFn = jest.fn((item) => `${item.name}: ${item.value}`);

    render(
      <PopoverList
        list={list}
        anchorPos={anchorPos}
        handleClose={jest.fn()}
        formatText={formatFn}
      />
    );

    expect(formatFn).toHaveBeenCalledTimes(list.length);
    expect(formatFn).toHaveBeenCalledWith(list[0]);
    expect(formatFn).toHaveBeenCalledWith(list[1]);
  });
});
