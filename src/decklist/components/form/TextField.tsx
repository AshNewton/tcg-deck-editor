import MuiTextField from "@mui/material/TextField";

type Props = any;

const TextField = (props: Props) => {
  const { input, meta, label, ...rest } = props;

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
