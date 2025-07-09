import MtgCardDetails from "./mtg/CardDetails";
import PokemonCardDetails from "./pokemon/CardDetails";
import YugiohCardDetails from "./yugioh/CardDetails";

import DisplayCard from "./mui/DisplayCard";

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
    <DisplayCard>
      {game === MTG_NAME && (
        <MtgCardDetails card={card} clearSelection={clearSelection} />
      )}
      {game === POKEMON_NAME && (
        <PokemonCardDetails card={card} clearSelection={clearSelection} />
      )}
      {game === YUGIOH_NAME && (
        <YugiohCardDetails card={card} clearSelection={clearSelection} />
      )}
    </DisplayCard>
  );
};

export default CardDetails;
