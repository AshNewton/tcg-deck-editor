import MuiButton from "@mui/material/Button";

const Button = (props) => {
  const { text = "placeholder", ...rest } = props;

  return (
    <MuiButton variant="contained" {...rest}>
      {text}
    </MuiButton>
  );
};

export default Button;
