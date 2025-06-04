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
      maxWidth="100%"
      m={2}
      {...rest}
    />
  );
};

export default Image;
