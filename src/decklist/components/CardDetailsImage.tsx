import { useDrag } from "react-dnd";

import Image from "./mui/Image";

import Box from "@mui/material/Box";

import { Card } from "../../types";
import { getCardImage } from "../util/util";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setSelectedCard } from "../../store/slices/uiSlice";

export const ItemTypes = { CARD: "CARD" };

type Props = {
  card: Card;
};

const CardDetailsImage = (props: Props) => {
  const { card } = props;

  const game = useAppSelector((state) => state.ui.game);
  const selectedCard = useAppSelector((state) => state.ui.selectedCard);

  const dispatch = useAppDispatch();

  const toggleSelectedCard = () => {
    const isSameCard = selectedCard?.details?.name === card.details?.name;
    dispatch(setSelectedCard(isSameCard ? null : card));
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card.name, card },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return drag(
    <div>
      <Box
        sx={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
        }}
      >
        <Image
          src={getCardImage(card.name, [card], game) || ""}
          alt={card.name}
          onClick={toggleSelectedCard}
        />
      </Box>
    </div>
  );
};

export default CardDetailsImage;
