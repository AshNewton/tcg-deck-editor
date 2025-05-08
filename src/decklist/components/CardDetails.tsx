import YugiohCardDetails from "./yugioh/CardDetails";

import MuiCard from "@mui/material/Card";

import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const CardDetails = () => {
  const card = useAppSelector((state) => state.ui.selectedCard);

  const dispatch = useAppDispatch();

  return (
    card && (
      <MuiCard>
        <YugiohCardDetails
          card={card}
          clearSelection={() => dispatch(setSelectedCard(null))}
        />
      </MuiCard>
    )
  );
};

export default CardDetails;
