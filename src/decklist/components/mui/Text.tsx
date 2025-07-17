import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

type Props = {
  text?: string | number;
  noWrap?: boolean;
  fontSize?: number;
  [key: string]: any;
};

const Text = (props: Props) => {
  const { text, noWrap = false, fontSize = 16, ...rest } = props;

  if (noWrap) {
    return (
      <Tooltip
        title={text}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: fontSize,
            },
          },
        }}
      >
        <Typography
          fontSize={fontSize}
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          {...rest}
        >
          {text}
        </Typography>
      </Tooltip>
    );
  }

  return (
    <Typography fontSize={fontSize} {...rest}>
      {text}
    </Typography>
  );
};

export default Text;
