import React from "react";
import { useDrop } from "react-dnd";

import Text from "../mui/Text";

import Paper from "@mui/material/Paper";

import { Card } from "../../../types";
import { DnDItemTypes } from "../../util/constants";

export type CardOnBoard = {
  id: string;
  card: Card;
  x: number;
  y: number;
};

type DropZoneProps = {
  label: string;
  onDropCard?: (cardId: string, x: number, y: number) => void;
  width?: number;
  height?: number;
  isVisibleAfterDrop?: boolean;
  children?: any;
  [key: string]: any;
};

const DropZone = (props: DropZoneProps) => {
  const {
    label,
    onDropCard,
    width = 140,
    height = 200,
    isVisibleAfterDrop = false,
    children,
    ...rest
  } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop(() => ({
    accept: DnDItemTypes.CARD,
    drop: (item: CardOnBoard, monitor) => {
      if (!onDropCard || !ref.current) return;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      if (isVisibleAfterDrop) {
        const rect = ref.current.getBoundingClientRect();
        const x = clientOffset.x - rect.left;
        const y = clientOffset.y - rect.top;
        onDropCard(item.id, x, y);
      } else {
        onDropCard(item.id, 0, 0);
      }
    },
  }));

  drop(ref);

  return (
    <Paper
      ref={ref}
      sx={{
        width,
        height,
        p: 1,
        border: "2px dashed gray",
        textAlign: "center",
        position: "relative",
        ...rest.sx,
      }}
    >
      <Text text={label} />
      {children}
    </Paper>
  );
};

export default DropZone;
