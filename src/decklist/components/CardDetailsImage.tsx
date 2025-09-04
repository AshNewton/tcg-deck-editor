import React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import Image from "./mui/Image";

import Box from "@mui/material/Box";

import { getCardImage } from "../util/util";
import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Card } from "../../types";
import { DnDItemTypes } from "../util/constants";

export type DraggableZone = "hand" | "table";

type Props = {
  id: string;
  card: Card;
  draggableZone?: DraggableZone
  [key: string]: any;
};

const CardDetailsImage = (props: Props) => {
  const { card, id, draggableZone, ...rest } = props;

  const game = useAppSelector((state) => state.ui.game);
  const selectedCard = useAppSelector((state) => state.ui.selectedCard);

  const dispatch = useAppDispatch();

  const toggleSelectedCard = () => {
    const isSameCard = selectedCard?.details?.name === card.details?.name;
    dispatch(setSelectedCard(isSameCard ? null : card));
  };

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: DnDItemTypes.CARD,
    item: { id: id, card, sourceZone: draggableZone },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return drag(
    <div>
      <Box
        sx={{
          opacity: isDragging ? 0.0 : 1,
          cursor: "grab",
          ...rest.sx,
        }}
        {...rest}
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
