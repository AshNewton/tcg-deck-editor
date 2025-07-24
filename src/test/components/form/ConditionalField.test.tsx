import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "react-final-form";

import ConditionalField from "../../../decklist/components/form/ConditionalField";

const renderWithForm = (initialValues = {}) => {
  const handleSubmit = jest.fn();

  render(
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <ConditionalField
            checkboxName="showExtra"
            checkboxLabel="Show extra options"
          >
            <div data-testid="conditional-content">Extra Content</div>
          </ConditionalField>
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );

  return handleSubmit;
};

describe("ConditionalField", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the checkbox with correct label", () => {
    renderWithForm();
    expect(screen.getByLabelText("Show extra options")).toBeInTheDocument();
  });

  it("does not show children initially", () => {
    renderWithForm();
    expect(screen.queryByTestId("conditional-content")).not.toBeInTheDocument();
  });

  it("shows children when checkbox is checked", () => {
    renderWithForm();

    const checkbox = screen.getByLabelText("Show extra options");
    fireEvent.click(checkbox);

    expect(screen.getByTestId("conditional-content")).toBeInTheDocument();
  });

  it("hides children when checkbox is unchecked again", () => {
    renderWithForm();

    const checkbox = screen.getByLabelText("Show extra options");
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(screen.queryByTestId("conditional-content")).not.toBeInTheDocument();
  });

  it("checkbox updates form state", () => {
    const handleSubmit = renderWithForm();

    fireEvent.click(screen.getByLabelText("Show extra options"));
    fireEvent.click(screen.getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
      { showExtra: true },
      expect.anything(),
      expect.anything()
    );
  });
});
