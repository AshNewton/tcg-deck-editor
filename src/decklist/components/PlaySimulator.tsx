import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import Button from "./mui/Button";
import CardDetailsImage from "./CardDetailsImage";
import CustomDragLayer from "./dnd/CustomDragLayer";
import DisplayCard from "./mui/DisplayCard";
import DropZone from "./dnd/DropZone";
import PopoverList from "./mui/PopoverList";
import Text from "./mui/Text";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ReplayIcon from "@mui/icons-material/Replay";

import { isYugioh } from "../util/util";
import { shuffleDeck } from "../util/deckAnalytics";
import { useAppSelector } from "../../hooks";

import { CardOnBoard } from "./dnd/DropZone";
import { Deck } from "../../types";
import { Divider, PopoverPosition } from "@mui/material";

type PopoverContent = null | "Deck" | "Extra" | "Discard" | "Exile";

type RightClickContent = {
  mouseX: number;
  mouseY: number;
  cardId: string | null;
};

const createDuplicatesAndShuffle = (source: Deck): Deck =>
  shuffleDeck(
    source.flatMap((card) =>
      Array.from({ length: card.copies }, () => ({ ...card }))
    )
  );

const PlayTable = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);
  const game = useAppSelector((state) => state.ui.game);

  // the deck(s) we're playing the game with
  const [deck, setDeck] = React.useState<Deck>(
    createDuplicatesAndShuffle(maindeck)
  );
  const [extra, setExtra] = React.useState(
    createDuplicatesAndShuffle(extradeck)
  );

  // areas cards can be when not in the deck
  const [tableCards, setTableCards] = React.useState<Array<CardOnBoard>>([]);
  const [discardPile, setDiscardPile] = React.useState<Array<CardOnBoard>>([]);
  const [exilePile, setExilePile] = React.useState<Array<CardOnBoard>>([]);

  // for menu to take cards out of a pile and onto the table
  const [openPopover, setOpenPopover] = React.useState<PopoverContent>(null);
  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null
  );

  // for right-click menu
  const [contextMenu, setContextMenu] =
    React.useState<RightClickContent | null>(null);

  const { t } = useTranslation();

  const reset = () => {
    setDeck(createDuplicatesAndShuffle(maindeck));
    setExtra(createDuplicatesAndShuffle(extradeck));
    setTableCards([]);
    setDiscardPile([]);
    setExilePile([]);
  };

  const drawCard = () => {
    if (deck.length === 0) return;
    const card = deck[0];
    setDeck(deck.slice(1));
    setTableCards((prev) => [
      ...prev,
      {
        id: uuidv4(),
        card,
        x: Math.random() * 100 + 50,
        y: Math.random() * 100,
        rotation: 0,
      },
    ]);
  };

  const shuffle = () => {
    if (deck.length === 0) return;
    setDeck(shuffleDeck(deck));
  };

  const moveCardToZone = (cardId: string, addToZone: (card: any) => void) => {
    setTableCards((prev) => {
      const cardObj = prev.find((c) => c.id === cardId);
      if (!cardObj) return prev;
      addToZone(cardObj);
      return prev.filter((c) => c.id !== cardId);
    });
  };

  const moveToExtra = (cardId: string) =>
    moveCardToZone(cardId, (c) => setExtra((prev) => [c.card, ...prev]));

  const moveToDeck = (cardId: string) =>
    moveCardToZone(cardId, (c) =>
      setDeck((prev) => shuffleDeck([c.card, ...prev]))
    );

  const moveToTopDeck = (cardId: string) =>
    moveCardToZone(cardId, (c) => setDeck((prev) => [c.card, ...prev]));

  const moveToBottomDeck = (cardId: string) =>
    moveCardToZone(cardId, (c) => setDeck((prev) => [...prev, c.card]));

  const moveToDiscard = (cardId: string) =>
    moveCardToZone(cardId, (c) => setDiscardPile((prev) => [c, ...prev]));

  const moveToExile = (cardId: string) =>
    moveCardToZone(cardId, (c) => setExilePile((prev) => [c, ...prev]));

  const moveCard = (cardId: string, x: number, y: number) => {
    setTableCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, x, y } : c))
    );
  };

  const moveCardFromPileToTable = (
    setPile: React.Dispatch<React.SetStateAction<Array<any>>>,
    matchFn: (c: any) => boolean,
    wrapCard?: boolean
  ) => {
    setPile((prevPile) => {
      const cardIndex = prevPile.findIndex(matchFn);
      if (cardIndex === -1) return prevPile;

      const card = prevPile[cardIndex];
      const newPile = [...prevPile];
      newPile.splice(cardIndex, 1);

      setTableCards((prevTable) => [
        ...prevTable,
        wrapCard
          ? {
            card, // for cards from a deck
            id: uuidv4(),
            x: Math.random() * 100 + 50,
            y: Math.random() * 100,
          }
          : {
            ...card, // for discard/exile cards
            x: Math.random() * 100 + 50,
            y: Math.random() * 100,
          },
      ]);

      return newPile;
    });
  };

  const moveOutOfPile = (item: any) => {
    if (openPopover === "Deck") {
      moveCardFromPileToTable(setDeck, (c) => c.name === item.name, true);
    } else if (openPopover === "Extra") {
      moveCardFromPileToTable(setExtra, (c) => c.name === item.name, true);
    } else if (openPopover === "Discard") {
      moveCardFromPileToTable(setDiscardPile, (c) => c.id === item.id);
    } else if (openPopover === "Exile") {
      moveCardFromPileToTable(setExilePile, (c) => c.id === item.id);
    }

    handleClose();
  };

  const showPopover = (type: PopoverContent) => (e: React.MouseEvent) => {
    setOpenPopover(type);
    setAnchorPos({ top: e.clientY, left: e.clientX });
  };

  const handleClose = () => {
    setOpenPopover(null);
    setAnchorPos(null);
  };

  const handleContextMenu = (event: React.MouseEvent, cardId: string) => {
    event.preventDefault(); // stop default browser menu
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4, cardId }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const rotateCard = (cardId: string, amount: number = 90) => {
    setTableCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, rotation: ((c.rotation ?? 0) + amount) % 360 }
          : c
      )
    );
  };

  return (
    <Box sx={{ maxWidth: "100%", display: "flex", gap: 2, ml: 2, alignItems: "center" }}>
      {/* Left sidebar */}
      {isYugioh(game) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <DropZone
            label={t("yugioh.extraDeck")}
            onDropCard={moveToExtra}
            onclick={showPopover("Extra")}
          >
            {t("decklist.cardCount", { count: extra.length })}
          </DropZone>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          mx: 2,
        }}
      >
        {/* Table area */}
        <DisplayCard
          sx={{
            m: 2,
            position: "relative",
            border: "2px solid #444",
            overflow: "hidden",
          }}
        >
          <DropZone
            onDropCard={moveCard}
            isVisibleAfterDrop
            sx={{
              flex: 1,
              height: "100%",
              width: "100%",
              position: "relative",
              overflow: "hidden",
              minHeight: "700px",
              minWidth: "1240px",
            }}
          >
            {tableCards.map((card) => (
              <CardDetailsImage
                key={card.id}
                id={card.id}
                card={card.card}
                sx={{
                  width: 140,
                  cursor: "grab",
                  top: card.y,
                  left: card.x - 70,
                  position: "absolute",
                  transform: `rotate(${card.rotation ?? 0}deg)`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease",
                }}
                onContextMenu={(e: React.MouseEvent) =>
                  handleContextMenu(e, card.id)
                }
              />
            ))}
          </DropZone>
        </DisplayCard>
      </Box>

      {/* Right sidebar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          justifyContent: "flex-end",
        }}
      >
        <IconButton size="large" onClick={reset}>
          <ReplayIcon />
        </IconButton>
        <Button
          text={t("playtest.drawCard")}
          onClick={drawCard}
          sx={{ mt: 2 }}
        />
        <Button text={t("playtest.shuffle")} onClick={shuffle} sx={{ mt: 2 }} />

        <DropZone
          label={t("common.deck")}
          onDropCard={moveToTopDeck}
          onclick={showPopover("Deck")}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: deck.length })}
        </DropZone>

        <DropZone
          label={t("playtest.discard")}
          onDropCard={moveToDiscard}
          onclick={showPopover("Discard")}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: discardPile.length })}
        </DropZone>
        <DropZone
          label={t("playtest.exile")}
          onDropCard={moveToExile}
          onclick={showPopover("Exile")}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: exilePile.length })}
        </DropZone>
      </Box>

      {/* Popover for cards from deck */}
      <PopoverList
        list={
          openPopover === "Deck"
            ? deck
            : openPopover === "Extra"
              ? extra
              : openPopover === "Discard"
                ? discardPile
                : openPopover === "Exile"
                  ? exilePile
                  : []
        }
        formatText={
          openPopover === "Deck" || openPopover === "Extra" ? (c) => c.name : (c) => c.card.name
        }
        onItemClick={moveOutOfPile}
        handleClose={handleClose}
        anchorPos={anchorPos}
      />

      {/* Right-click menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (contextMenu?.cardId) rotateCard(contextMenu.cardId, 90);
            handleCloseContextMenu();
          }}
        >
          {t("playtest.rotateRight")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu?.cardId) rotateCard(contextMenu.cardId, -90);
            handleCloseContextMenu();
          }}
        >
          {t("playtest.rotateLeft")}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (contextMenu?.cardId) moveToDeck(contextMenu.cardId);
          handleCloseContextMenu();
        }}>
          {t("playtest.returnToDeck")}
        </MenuItem>
        <MenuItem onClick={() => {
          if (contextMenu?.cardId) moveToTopDeck(contextMenu.cardId);
          handleCloseContextMenu();
        }}>
          {t("playtest.returnToTopDeck")}
        </MenuItem>
        <MenuItem onClick={() => {
          if (contextMenu?.cardId) moveToBottomDeck(contextMenu.cardId);
          handleCloseContextMenu();
        }}>
          {t("playtest.returnToBottomDeck")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default function PlaySimulator() {
  return (
    <DndProvider backend={HTML5Backend}>
      <PlayTable />
      <CustomDragLayer />
    </DndProvider>
  );
}
