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
import ReplayIcon from "@mui/icons-material/Replay";

import { isYugioh } from "../util/util";
import { shuffleDeck } from "../util/deckAnalytics";
import { useAppSelector } from "../../hooks";

import { CardOnBoard } from "./dnd/DropZone";
import { Deck } from "../../types";
import { PopoverPosition } from "@mui/material";

type PopoverContent = null | "Extra" | "Discard" | "Exile";

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

  const [deck, setDeck] = React.useState<Deck>(
    createDuplicatesAndShuffle(maindeck)
  );

  const [extra, setExtra] = React.useState(
    createDuplicatesAndShuffle(extradeck)
  );

  const [tableCards, setTableCards] = React.useState<Array<CardOnBoard>>([]);
  const [discardPile, setDiscardPile] = React.useState<Array<CardOnBoard>>([]);
  const [exilePile, setExilePile] = React.useState<Array<CardOnBoard>>([]);

  const [openPopover, setOpenPopover] = React.useState<PopoverContent>(null);
  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null
  );

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

  const showPopover = (type: PopoverContent) => (e: React.MouseEvent) => {
    setOpenPopover(type);
    setAnchorPos({ top: e.clientY, left: e.clientX });
  };

  const handleClose = () => {
    setOpenPopover(null);
    setAnchorPos(null);
  };

  return (
    <Box sx={{ maxWidth: "100%", display: "flex", gap: 2, ml: 2 }}>
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
        {/* Bar above play area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            m: 2,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <IconButton size="large" onClick={reset}>
            <ReplayIcon />
          </IconButton>
          <DropZone
            label={t("playtest.returnToDeck")}
            onDropCard={moveToDeck}
            sx={{ height: 100 }}
          ></DropZone>
          <DropZone
            label={t("playtest.returnToTopDeck")}
            onDropCard={moveToTopDeck}
            sx={{ height: 100 }}
          ></DropZone>
          <DropZone
            label={t("playtest.returnToBottomDeck")}
            onDropCard={moveToBottomDeck}
            sx={{ height: 100 }}
          ></DropZone>
        </Box>

        {/* Table area */}
        <DisplayCard
          sx={{
            m: 2,
            position: "relative",
            height: "1000%",
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
              minHeight: "600px",
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
                }}
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
        <Button
          text={t("playtest.drawCard")}
          onClick={drawCard}
          sx={{ mt: 2 }}
        />
        <Button text={t("playtest.shuffle")} onClick={shuffle} sx={{ mt: 2 }} />

        <Text text={t("common.deck")} mt={2} />
        <Text text={t("decklist.cardCount", { count: deck.length })} />

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
          openPopover === "Extra"
            ? extra
            : openPopover === "Discard"
            ? discardPile
            : openPopover === "Exile"
            ? exilePile
            : []
        }
        handleClose={handleClose}
        formatText={
          openPopover === "Extra" ? (c) => c.name : (c) => c.card.name
        }
        anchorPos={anchorPos}
      />
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
