import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";

import Button from "./mui/Button";
import CardDetailsImage from "./CardDetailsImage";
import CustomDragLayer from "./dnd/CustomDragLayer";
import DisplayCard from "./mui/DisplayCard";
import DropZone from "./dnd/DropZone";
import Text from "./mui/Text";

import Box from "@mui/material/Box";

import { isYugioh } from "../util/util";
import { shuffleDeck } from "../util/deckAnalytics";
import { useAppSelector } from "../../hooks";

import { Deck } from "../../types";
import { CardOnBoard } from "./dnd/DropZone";
import { useTranslation } from "react-i18next";

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

  const [extra, setExtra] = React.useState(extradeck);

  const [tableCards, setTableCards] = React.useState<Array<CardOnBoard>>([]);
  const [discardPile, setDiscardPile] = React.useState<Array<CardOnBoard>>([]);
  const [exilePile, setExilePile] = React.useState<Array<CardOnBoard>>([]);

  const { t } = useTranslation();

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

  return (
    <Box sx={{ maxWidth: "100%", display: "flex", gap: 2, ml: 2 }}>
      {/* Left sidebar */}
      {isYugioh(game) && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <DropZone label={t("yugioh.extraDeck")} onDropCard={moveToDiscard}>
            {t("decklist.cardCount", { count: extra.length })}
          </DropZone>
        </Box>
      )}

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
          label={t("playtest.playArea")}
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

      {/* Right sidebar */}
      <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
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
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: discardPile.length })}
        </DropZone>
        <DropZone
          label={t("playtest.exile")}
          onDropCard={moveToExile}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: exilePile.length })}
        </DropZone>
      </Box>
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
