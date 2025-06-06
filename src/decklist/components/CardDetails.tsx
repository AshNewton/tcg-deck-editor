import MtgCardDetails from "./mtg/CardDetails";
import YugiohCardDetails from "./yugioh/CardDetails";

import MuiCard from "@mui/material/Card";

import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { MTG_NAME } from "../util/mtg";
import { YUGIOH_NAME } from "../util/yugioh";

const CardDetails = () => {
  const card = useAppSelector((state) => state.ui.selectedCard);

  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const clearSelection = () => dispatch(setSelectedCard(null));

  if (!card) {
    return <></>;
  }

  if (game === YUGIOH_NAME) {
    return (
      <MuiCard>
        <YugiohCardDetails card={card} clearSelection={clearSelection} />
      </MuiCard>
    );
  }

  if (game === MTG_NAME) {
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
        <MtgCardDetails card={card} clearSelection={clearSelection} />
      </MuiCard>
    );
  }
};

export default CardDetails;
