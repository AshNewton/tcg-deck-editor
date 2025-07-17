import MuiButton from "@mui/material/Button";

type Props = {
  text: string;
  [key: string]: any;
};

const Button = (props: Props) => {
  const { text, ...rest } = props;

  return (
    <MuiButton variant="contained" {...rest}>
      {text}
    </MuiButton>
  );
};

export default Button;
