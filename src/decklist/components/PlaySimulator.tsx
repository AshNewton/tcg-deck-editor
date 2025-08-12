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

const PlayTable = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);
  const game = useAppSelector((state) => state.ui.game);

  const [deck, setDeck] = React.useState<Deck>(
    shuffleDeck(
      maindeck.flatMap((card) =>
        Array.from({ length: card.copies }, (_) => ({
          ...card,
        }))
      )
    )
  );

  const [extra, setExtra] = React.useState(
    extradeck.flatMap((card) =>
      Array.from({ length: card.copies }, (_) => ({
        ...card,
      }))
    )
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
    setDeck(
      shuffleDeck(
        maindeck.flatMap((card) =>
          Array.from({ length: card.copies }, (_) => ({
            ...card,
          }))
        )
      )
    );
    setExtra(
      shuffleDeck(
        extradeck.flatMap((card) =>
          Array.from({ length: card.copies }, (_) => ({
            ...card,
          }))
        )
      )
    );
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

  const moveToExtra = (cardId: string) => {
    setTableCards((prevTableCards) => {
      const card = prevTableCards.find((c) => c.id === cardId);
      if (!card) return prevTableCards;
      setExtra((prevExtra) => [card.card, ...prevExtra]);
      return prevTableCards.filter((c) => c.id !== cardId);
    });
  };

  const moveToDeck = (cardId: string) => {
    setTableCards((prevTableCards) => {
      const card = prevTableCards.find((c) => c.id === cardId);
      if (!card) return prevTableCards;
      setDeck((prevDeck) => shuffleDeck([card.card, ...prevDeck]));
      return prevTableCards.filter((c) => c.id !== cardId);
    });
  };

  const moveToTopDeck = (cardId: string) => {
    setTableCards((prevTableCards) => {
      const card = prevTableCards.find((c) => c.id === cardId);
      if (!card) return prevTableCards;
      setDeck((prevDeck) => [card.card, ...prevDeck]);
      return prevTableCards.filter((c) => c.id !== cardId);
    });
  };

  const moveToBottomDeck = (cardId: string) => {
    setTableCards((prevTableCards) => {
      const card = prevTableCards.find((c) => c.id === cardId);
      if (!card) return prevTableCards;
      setDeck((prevDeck) => [...prevDeck, card.card]);
      return prevTableCards.filter((c) => c.id !== cardId);
    });
  };

  const moveToDiscard = (cardId: string) => {
    setTableCards((prevTableCards) => {
      const card = prevTableCards.find((c) => c.id === cardId);
      if (!card) return prevTableCards;
      setDiscardPile((prevDisc) => [card, ...prevDisc]);
      return prevTableCards.filter((c) => c.id !== cardId);
    });
  };

  const moveToExile = (cardId: string) => {
    setTableCards((prevTableCards) => {
      const card = prevTableCards.find((c) => c.id === cardId);
      if (!card) return prevTableCards;
      setExilePile((prevExile) => [card, ...prevExile]);
      return prevTableCards.filter((c) => c.id !== cardId);
    });
  };

  const moveCard = (cardId: string, x: number, y: number) => {
    setTableCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, x, y } : c))
    );
  };

  const showExtraCards = (e: React.MouseEvent) => {
    setOpenPopover("Extra");
    setAnchorPos({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const showDiscardCards = (e: React.MouseEvent) => {
    setOpenPopover("Discard");
    setAnchorPos({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const showExileCards = (e: React.MouseEvent) => {
    setOpenPopover("Exile");
    setAnchorPos({
      top: e.clientY,
      left: e.clientX,
    });
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
            label={t("playtest.returnToExtra")}
            onDropCard={moveToExtra}
            sx={{ height: 100 }}
          ></DropZone>
          <DropZone
            label={t("yugioh.extraDeck")}
            onDropCard={moveToDiscard}
            onclick={showExtraCards}
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
            //label={t("playtest.playArea")}
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
          onclick={showDiscardCards}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: discardPile.length })}
        </DropZone>
        <DropZone
          label={t("playtest.exile")}
          onDropCard={moveToExile}
          onclick={showExileCards}
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
