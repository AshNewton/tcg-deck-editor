import React from "react";
import { Field } from "react-final-form";
import {
  Slider,
  SliderProps,
  Typography,
  Box,
  TextField,
  Grid,
} from "@mui/material";

type MultiThumbSliderProps = {
  name: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderProps["marks"];
  defaultValue?: number[];
  disabled?: boolean;
  showInputs?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const MultiThumbSlider: React.FC<MultiThumbSliderProps> = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  marks,
  defaultValue = [20, 80],
  disabled = false,
  showInputs = false,
}) => {
  return (
    <Field<number[]> name={name} initialValue={defaultValue}>
      {({ input, meta }) => {
        const [lower, upper] = input.value || defaultValue;

        const handleSliderChange = (_: Event, newValue: number | number[]) => {
          if (Array.isArray(newValue)) {
            input.onChange(newValue);
          }
        };

        const handleLowerInputChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const newLower = clamp(Number(e.target.value), min, upper);
          input.onChange([newLower, upper]);
        };

        const handleUpperInputChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const newUpper = clamp(Number(e.target.value), lower, max);
          input.onChange([lower, newUpper]);
        };

        return (
          <Box sx={{ width: 300, my: 2 }}>
            {label && <Typography gutterBottom>{label}</Typography>}
            <Slider
              value={[lower, upper]}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              step={step}
              min={min}
              max={max}
              marks={marks}
              disabled={disabled}
            />

            {showInputs && (
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Min"
                    type="number"
                    size="small"
                    fullWidth
                    value={lower}
                    onChange={handleLowerInputChange}
                    inputProps={{
                      min: min,
                      max: upper,
                      step,
                    }}
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max"
                    type="number"
                    size="small"
                    fullWidth
                    value={upper}
                    onChange={handleUpperInputChange}
                    inputProps={{
                      min: lower,
                      max: max,
                      step,
                    }}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            )}

            {meta.touched && meta.error && (
              <Typography color="error" variant="caption">
                {meta.error}
              </Typography>
            )}
          </Box>
        );
      }}
    </Field>
  );
};

export default MultiThumbSlider;
