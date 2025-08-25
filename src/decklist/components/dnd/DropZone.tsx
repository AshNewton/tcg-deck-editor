import React from "react";
import { useDrop } from "react-dnd";

import Text from "../mui/Text";

import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import MuiCard from "@mui/material/Card";

import { Card } from "../../../types";
import { DnDItemTypes } from "../../util/constants";

export type CardOnBoard = {
  rotation: number;
  id: string;
  card: Card;
  x: number;
  y: number;
};

type DropZoneProps = {
  label?: string;
  onDropCard?: (cardId: string, x: number, y: number) => void;
  onclick?: (e: React.MouseEvent) => void;
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
    onclick,
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
    <MuiCard
      ref={ref}
      sx={{
        width,
        height,
        p: 1,
        border: "2px dashed gray",
        textAlign: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        ...rest.sx,
      }}
    >
      {onclick ? (
        <CardActionArea
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <CardContent
            onClick={onclick}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {label && <Text text={label} />}
            {children}
          </CardContent>
        </CardActionArea>
      ) : (
        <>
          {label && <Text text={label} />} {children}
        </>
      )}
    </MuiCard>
  );
};

export default DropZone;
