import { render, screen } from "@testing-library/react";

import Image from "../../../decklist/components/mui/Image";

describe("Image component", () => {
  it("renders with src and alt attributes", () => {
    render(<Image src="image.jpg" alt="Test image" />);
    const img = screen.getByRole("img", { name: "Test image" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "image.jpg");
    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("sets the title attribute equal to alt", () => {
    render(<Image src="image.jpg" alt="Title test" />);
    const img = screen.getByRole("img", { name: "Title test" });
    expect(img).toHaveAttribute("title", "Title test");
  });

  it("passes additional props to the image", () => {
    render(
      <Image src="image.jpg" alt="Extra props" data-testid="custom-img" />
    );
    const img = screen.getByTestId("custom-img");
    expect(img).toHaveAttribute("src", "image.jpg");
    expect(img).toHaveAttribute("alt", "Extra props");
  });
});
