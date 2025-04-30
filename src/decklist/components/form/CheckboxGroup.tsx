import { Field } from "react-final-form";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";

type Props = {
  name: string;
  label: string;
  options: Array<string>;
  columns?: number;
};

const CheckboxGroup = (props: Props) => {
  const { name, label, options, columns = 1 } = props;

  return (
    <Field name={name}>
      {({ input }) => {
        const selectedValues: string[] = input.value || [];

        const handleChange = (option: string) => {
          const nextValue = selectedValues.includes(option)
            ? selectedValues.filter((val) => val !== option)
            : [...selectedValues, option];

          input.onChange(nextValue);
        };

        // Split options into chunks for columns
        const chunkSize = Math.ceil(options.length / columns);
        const columnChunks = Array.from({ length: columns }, (_, i) =>
          options.slice(i * chunkSize, (i + 1) * chunkSize)
        );

        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup sx={{ ml: 2 }}>
              <Grid container spacing={2}>
                {columnChunks.map((chunk, colIdx) => (
                  <Grid
                    item
                    xs
                    key={colIdx}
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {chunk.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={selectedValues.includes(option)}
                            onChange={() => handleChange(option)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </FormControl>
        );
      }}
    </Field>
  );
};

export default CheckboxGroup;
