import CardDetails from "../components/CardDetails";
import StartingHand from "../components/StartingHand";

import Box from "@mui/material/Box";
import DeckSearch from "../components/DeckSearch";

const Body = () => {
  return (
    <Box>
      <CardDetails />
      <StartingHand />
      <DeckSearch />
    </Box>
  );
};

export default Body;
