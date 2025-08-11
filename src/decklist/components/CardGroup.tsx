import React from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";

import CardDetailsImage, { ItemTypes } from "./CardDetailsImage";
import DisplayCard from "./mui/DisplayCard";
import Text from "./mui/Text";

import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextField from "@mui/material/TextField";

import { Card, Deck } from "../../types";
import { useWindowWidth } from "../util/util";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getDeckSize } from "../util/deckAnalytics";

type Props = {
  id: string;
  name: string;
  cards: Deck;
  onDrop: (card: Card, toGroupId: string) => void;
  onRename: (id: string, newName: string) => void;
  onRemove: (id: string) => void;
};

const CardGroup = (props: Props) => {
  const { id, name, cards, onDrop, onRename, onRemove } = props;

  const [editing, setEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(name);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const width = useWindowWidth();

  const { t } = useTranslation();

  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
  const cardOverlap = width * (isSmall ? 0.1 : 0.018);

  // Adjust container height to fit overlapped cards
  const containerHeight =
    cardOverlap * cards.length +
    width * (cards.length > 0 ? (isSmall ? 0.9 : 0.17) : 0);

  return drop(
    <div>
      <DisplayCard>
        <Box display="flex" flexDirection="row" alignItems="center">
          {editing ? (
            <TextField
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              size="small"
              autoFocus
            />
          ) : (
            <>
              <Text text={name} mr={1} noWrap />
              <Text text={`(${getDeckSize(cards)})`} />
              <IconButton
                size="small"
                onClick={() => {
                  setEditing(true);
                  setTempName(name);
                }}
                aria-label={t("common.rename")}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onRemove(id);
              }}
              disabled={!!cards.length}
            >
              {t("common.delete")}
            </MenuItem>
          </Menu>
        </Box>

        <Box
          sx={{
            position: "relative",
            height: `${containerHeight}px`,
          }}
        >
          {cards
            .sort((a: Card, b: Card) => {
              return a.name.localeCompare(b.name);
            })
            .map((card, index) => (
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
