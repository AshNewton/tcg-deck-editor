import * as React from "react";

import CardDetails from "../components/CardDetails";

import Box from "@mui/material/Box";

const Body = (props) => {
  const { selectedCard, onCardDeselect } = props;

  return (
    <Box>
      {selectedCard && (
        <CardDetails card={selectedCard} onCardDeselect={onCardDeselect} />
      )}
    </Box>
  );
};

export default Body;
