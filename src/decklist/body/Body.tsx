import CardDetails from "../components/CardDetails";
import DeckOrganizer from "../components/DeckOrganizer";
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
      {menu === "Deck Organizer" && <DeckOrganizer />}
      {menu === "Starting Hand" && <StartingHand />}
      {menu === "Deck Search" && <DeckSearch />}
      {menu === "Color Breakdown" && <Mana />}
    </Box>
  );
};

export default Body;
