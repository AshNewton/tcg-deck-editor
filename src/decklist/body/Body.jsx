import * as React from "react";

import CardDetails from "../components/CardDetails";

import Box from "@mui/material/Box";
import StartingHand from "../components/StartingHand";

const Body = (props) => {
  const { selectedCard, onCardDeselect, maindeck } = props;

  return (
    <Box>
      {/* see details on selected card */}
      {selectedCard && (
        <CardDetails card={selectedCard} onCardDeselect={onCardDeselect} />
      )}
      <StartingHand deck={maindeck} />
    </Box>
  );
};

export default Body;
