import MtgCardDetails from "./mtg/CardDetails";
import PokemonCardDetails from "./pokemon/CardDetails";
import YugiohCardDetails from "./yugioh/CardDetails";

import MuiCard from "@mui/material/Card";

import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { MTG_NAME } from "../util/mtg";
import { YUGIOH_NAME } from "../util/yugioh";
import { POKEMON_NAME } from "../util/pokemon";

const CardDetails = () => {
  const card = useAppSelector((state) => state.ui.selectedCard);

  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const clearSelection = () => dispatch(setSelectedCard(null));

  if (!card) {
    return <></>;
  }

  return (
    <MuiCard
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        mt: 2,
        ml: 2,
        mr: 2,
        p: 2,
      }}
    >
      {game === MTG_NAME && (
        <MtgCardDetails card={card} clearSelection={clearSelection} />
      )}
      {game === POKEMON_NAME && (
        <PokemonCardDetails card={card} clearSelection={clearSelection} />
      )}
      {game === YUGIOH_NAME && (
        <YugiohCardDetails card={card} clearSelection={clearSelection} />
      )}
    </MuiCard>
  );
};

export default CardDetails;
