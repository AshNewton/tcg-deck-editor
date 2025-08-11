import { useDragLayer } from "react-dnd";

import Image from "../mui/Image";

import Box from "@mui/material/Box";

import { getCardImage } from "../../util/util";
import { useAppSelector } from "../../../hooks";

const CustomDragLayer = () => {
  const game = useAppSelector((state) => state.ui.game);

  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !item || !currentOffset) return null;

  const { card } = item;

  const style = {
    position: "fixed",
    pointerEvents: "none",
    top: currentOffset.y,
    left: currentOffset.x,
    transform: "translate(-50%, 0%)",
    width: 140,
    height: 200,
    zIndex: 1000,
    opacity: 0.5,
  };

  return (
    <Box sx={style}>
      <Image
        src={getCardImage(card.name, [card], game) || ""}
        alt={card.name}
        draggable={false}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default CustomDragLayer;
