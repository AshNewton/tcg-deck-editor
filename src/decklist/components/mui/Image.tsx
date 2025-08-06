import Box from "@mui/material/Box";

type Props = {
  src: string;
  alt: string;
  [key: string]: any;
};

const Image = (props: Props) => {
  const { src, alt = src, ...rest } = props;

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      title={alt}
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        display: "block",
        ...rest.sx,
      }}
      {...rest}
    />
  );
};

export default Image;
