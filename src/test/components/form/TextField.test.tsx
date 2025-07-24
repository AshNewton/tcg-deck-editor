import { render, screen, fireEvent } from "@testing-library/react";
import { Form, Field } from "react-final-form";

import TextField from "../../../decklist/components/form/TextField";

const renderWithForm = (validate?: (val: string) => string | undefined) => {
  render(
    <Form
      onSubmit={jest.fn()}
      initialValues={{ name: "" }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            label="Name"
            validate={validate}
            component={TextField}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );
};

describe("TextField component", () => {
  it("renders with label", () => {
    renderWithForm();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("updates value on user input", () => {
    renderWithForm();
    const input = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Taco" } });
    expect(input.value).toBe("Taco");
  });

  it("shows validation error after touch", async () => {
    const validate = (value: string) => (value ? undefined : "Required");
    renderWithForm(validate);

    const input = screen.getByLabelText("Name");
    fireEvent.blur(input); // mark as touched
    fireEvent.submit(screen.getByText("Submit"));

    expect(await screen.findByText("Required")).toBeInTheDocument();
  });
});
