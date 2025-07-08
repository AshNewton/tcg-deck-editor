import { Field } from "react-final-form";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

type Props = {
  checkboxName: string;
  checkboxLabel: string;
  required?: boolean;
  children: React.ReactNode;
  [key: string]: any;
};

const ConditionalField = (props: Props) => {
  const { checkboxName, checkboxLabel, children, ...rest } = props;

  return (
    <>
      <Field name={checkboxName} type="checkbox">
        {({ input }) => (
          <FormControlLabel
            control={<Checkbox {...input} />}
            label={checkboxLabel}
            {...rest}
          />
        )}
      </Field>

      {/* Conditionally render this field if the checkbox is checked */}
      <Field name={checkboxName} subscription={{ value: true }}>
        {({ input }) => {
          const showField = input.value;
          return showField && <Box sx={{ pl: 4, py: 1 }}>{children}</Box>;
        }}
      </Field>
    </>
  );
};

export default ConditionalField;
