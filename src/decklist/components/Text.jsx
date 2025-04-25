import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const Text = (props) => {
  const {
    text = "placeholder",
    noWrap = false,
    fontSize = 16,
    ...rest
  } = props;

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
