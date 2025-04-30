import MuiTextField from "@mui/material/TextField";

const TextField = ({ input, meta, label, ...rest }: any) => {
  return (
    <MuiTextField
      {...input}
      {...rest}
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      error={meta.touched && meta.error}
      helperText={meta.touched && meta.error}
    />
  );
};

export default TextField;
