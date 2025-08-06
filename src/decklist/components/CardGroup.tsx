import React from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import CardDetailsImage, { ItemTypes } from "./CardDetailsImage";
import DisplayCard from "./mui/DisplayCard";

import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Card, Deck } from "../../types";
import { useWindowWidth } from "../util/util";

type Props = {
  id: string;
  name: string;
  cards: Deck;
  onDrop: (card: Card, toGroupId: string) => void;
  onRename: (id: string, newName: string) => void;
};

const CardGroup = (props: Props) => {
  const { id, name, cards, onDrop, onRename } = props;

  const [editing, setEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(name);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const width = useWindowWidth();

  const handleRenameSubmit = () => {
    if (tempName.trim() !== "") {
      onRename(id, tempName.trim());
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setTempName(name);
      setEditing(false);
    }
  };

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: { card: Card }) => onDrop(item.card, id),
  }));

  // Set overlap distance depending on screen size
  const cardOverlap = width * (isSmall ? 0.1 : 0.025);

  // Adjust container height to fit overlapped cards
  const containerHeight =
    cardOverlap * cards.length +
    width * (cards.length > 0 ? (isSmall ? 0.9 : 0.25) : 0);

  return drop(
    <div>
      <DisplayCard>
        <Box display="flex" flexDirection="row" alignItems="flex-start">
          {editing ? (
            <TextField
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              size="small"
              autoFocus
              sx={{ mr: 1 }}
            />
          ) : (
            <>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  setEditing(true);
                  setTempName(name);
                }}
                aria-label="Rename group"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>

        <Box
          sx={{
            position: "relative",
            height: `${containerHeight}px`,
          }}
        >
          {cards.map((card, index) => (
            <Box
              key={card.name}
              sx={{
                position: "absolute",
                top: `${index * cardOverlap}px`,
                zIndex: index,
              }}
            >
              <CardDetailsImage card={card} />
            </Box>
          ))}
        </Box>
      </DisplayCard>
    </div>
  );
};

export default CardGroup;
