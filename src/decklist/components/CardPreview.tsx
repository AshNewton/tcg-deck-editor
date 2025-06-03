import React from "react";

import Button from "./mui/Button";
import Text from "./mui/Text";

import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { isBasicLand } from "../util/mtg";
import { isYugioh } from "../util/util";
import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { YUGIOH_MAX_COPIES } from "../util/yugioh";
import { MTG_MAX_COPIES } from "../util/mtg";

import { Card } from "../../types";

interface Props {
  card: Card;
  onDelete: (name: string) => void;
  onAddCopy: (name: string) => void;
  onRemoveCopy: (name: string) => void;
}

const CardPreview = ({ card, onDelete, onAddCopy, onRemoveCopy }: Props) => {
  const selectedCard = useAppSelector((state) => state.ui.selectedCard);
  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const toggleSelectedCard = () => {
    const isSameCard = selectedCard?.details?.name === card.details?.name;
    dispatch(setSelectedCard(isSameCard ? null : card));
  };

  const handleInnerClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    onClick: (name: string) => void
  ) => {
    e.stopPropagation();
    onClick(card.name);
  };

  const maxCopies = isYugioh(game) ? YUGIOH_MAX_COPIES : MTG_MAX_COPIES;

  return (
    <Box
      onClick={toggleSelectedCard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggleSelectedCard();
      }}
      sx={{
        mt: 1,
        ml: 2,
        p: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.400",
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <IconButton
        onClick={(e) => handleInnerClick(e, onDelete)}
        aria-label="delete"
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Button
        text="-"
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          handleInnerClick(e, onRemoveCopy)
        }
        size="small"
        aria-label="remove copy"
      />

      <Text text={card.copies} />

      <Button
        text="+"
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          handleInnerClick(e, onAddCopy)
        }
        size="small"
        /* mtg basic lands can have any number of copies */
        disabled={card.copies === maxCopies && !isBasicLand(card)}
        aria-label="add copy"
      />

      <Text text={card.name} noWrap />
    </Box>
  );
};

export default CardPreview;
