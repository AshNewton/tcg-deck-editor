import React from "react";
import { useDrop } from "react-dnd";

import CardDetailsImage, { ItemTypes } from "./CardDetailsImage";
import DisplayCard from "./mui/DisplayCard";

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Card, Deck } from "../../types";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

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

        {cards.map((card) => (
          <CardDetailsImage key={card.name} card={card} />
        ))}
      </DisplayCard>
    </div>
  );
};

export default CardGroup;
