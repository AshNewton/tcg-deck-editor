import CardDetails from "../components/CardDetails";
import DeckSearch from "../components/DeckSearch";
import Mana from "../components/mtg/Mana";
import StartingHand from "../components/StartingHand";

import Box from "@mui/material/Box";

import { useAppSelector } from "../../hooks";

const Body = () => {
  const menu = useAppSelector((state) => state.ui.menu);

  return (
    <Box>
      <CardDetails />
      {menu === "Starting Hand" && <StartingHand />}
      {menu === "Deck Search" && <DeckSearch />}
      {menu === "Mana" && <Mana />}
    </Box>
  );
};

export default Body;
