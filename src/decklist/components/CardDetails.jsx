import Text from "./Text";

import Box from "@mui/material/Box";

const CardDetails = (props) => {
  const { card, onCardDeselect } = props;

  return (
    <>
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={2}
        px={2}
        py={1}
      >
        <Text text={card.name} fontSize={28} />
      </Box>
    </>
  );
};

export default CardDetails;
