import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "react-final-form";

import CheckboxGroup from "../../../decklist/components/form/CheckboxGroup";

const options = ["Option A", "Option B", "Option C"];

const renderWithForm = (initialValues = {}) => {
  const handleSubmit = jest.fn();

  render(
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CheckboxGroup
            name="testField"
            label="Choose Options"
            options={options}
            columns={2}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );
  return handleSubmit;
};

describe("CheckboxGroup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders label and checkboxes", () => {
    renderWithForm();

    expect(screen.getByText("Choose Options")).toBeInTheDocument();
    options.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("checkboxes update form state", () => {
    const handleSubmit = renderWithForm();

    fireEvent.click(screen.getByLabelText("Option A"));
    fireEvent.click(screen.getByText("Submit"));

    expect(handleSubmit).toHaveBeenCalledWith(
      { testField: ["Option A"] },
      expect.anything(),
      expect.anything()
    );
  });

  it("initial values are respected", () => {
    renderWithForm({ testField: ["Option B"] });

    const checkbox = screen.getByLabelText("Option B");
    expect(checkbox).toBeChecked();
  });

  it("checkbox unchecks when clicked again", () => {
    renderWithForm({ testField: ["Option A"] });

    const checkbox = screen.getByLabelText("Option A");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
