import { useDrag } from "react-dnd";

import Image from "./mui/Image";

import Box from "@mui/material/Box";

import { Card } from "../../types";
import { getCardImage } from "../util/util";
import { useAppSelector } from "../../hooks";

export const ItemTypes = { CARD: "CARD" };

type Props = {
  card: Card;
};

const CardDetailsImage = (props: Props) => {
  const { card } = props;

  const game = useAppSelector((state) => state.ui.game);

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
        />
      </Box>
    </div>
  );
};

export default CardDetailsImage;
