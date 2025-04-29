import { useSelector } from "react-redux";

import CardDetails from "../components/CardDetails";

import Box from "@mui/material/Box";
import StartingHand from "../components/StartingHand";

const Body = () => {
  const selectedCard = useSelector((state) => state.ui.selectedCard);

  return (
    <Box>
      {selectedCard && <CardDetails />}
      <StartingHand />
    </Box>
  );
};

export default Body;
