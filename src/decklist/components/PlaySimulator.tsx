import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import Button from "./mui/Button";
import CardDetailsImage, { DraggableZone } from "./CardDetailsImage";
import CustomDragLayer from "./dnd/CustomDragLayer";
import DisplayCard from "./mui/DisplayCard";
import DropZone from "./dnd/DropZone";
import PopoverList from "./mui/PopoverList";

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

type Pile = "deck" | "topDeck" | "bottomDeck" | "shuffledDeck" | "discard" | "exile" | "extra";

type RightClickContent = {
  mouseX: number;
  mouseY: number;
  cardId: string | null;
  zone: "hand" | "table";
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
  const [hand, setHand] = React.useState<Array<CardOnBoard>>([]);
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

  const drawCardToHand = () => {
    if (deck.length === 0) return;
    const card = deck[0];
    setDeck(deck.slice(1));
    setHand((prev) => [
      ...prev,
      {
        id: uuidv4(),
        card,
        x: Math.random() * 200 + 50,
        y: 0,
        rotation: 0,
      },
    ]);
  };

  const shuffle = () => {
    if (deck.length === 0) return;
    setDeck(shuffleDeck(deck));
  };


  const addToPile = (card: CardOnBoard, target: Pile) => {
    if (target === "discard") setDiscardPile(prev => [card, ...prev]);
    else if (target === "exile") setExilePile(prev => [card, ...prev]);
    else if (target === "extra") setExtra(prev => [card.card, ...prev]);
    else if (target === "deck") setDeck(prev => shuffleDeck([card.card, ...prev]));
    else if (target === "topDeck") setDeck(prev => [card.card, ...prev]);
    else if (target === "bottomDeck") setDeck(prev => [...prev, card.card]);
    else if (target === "shuffledDeck") setDeck(prev => shuffleDeck([card.card, ...prev]));
  };

  const moveCardToPile = (cardId: string, from: "table" | "hand", target: Pile) => {
    const removeFrom = from === "table" ? setTableCards : setHand;
    let cardObj: CardOnBoard | undefined;

    removeFrom(prev => {
      const idx = prev.findIndex(c => c.id === cardId);
      if (idx === -1) return prev;
      cardObj = prev[idx];
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });

    if (cardObj) addToPile(cardObj, target);
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

  const moveCardBetweenZones = (
    cardId: string,
    source: DraggableZone,
    target: DraggableZone,
    newX: number,
    newY: number
  ) => {
    let cardObj: CardOnBoard | undefined;

    // Remove from source
    const removeFrom = (setter: typeof setTableCards | typeof setHand) => {
      setter((prev) => {
        const index = prev.findIndex((c) => c.id === cardId);
        if (index === -1) return prev;
        cardObj = prev[index];
        const newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      });
    };

    if (source === "table") removeFrom(setTableCards);
    else removeFrom(setHand);

    if (!cardObj) return;

    const updatedCard = { ...cardObj, x: newX, y: newY };

    // Add to target
    if (target === "table") setTableCards((prev) => [...prev, updatedCard]);
    else setHand((prev) => [...prev, updatedCard]);
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

  const handleContextMenu = (event: React.MouseEvent, cardId: string, zone: "hand" | "table") => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4, cardId, zone }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    // blur the right-click menu before it unmounts to hide warning
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
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

  const returnActions: { label: string; pile: Pile }[] = [
    { label: t("playtest.returnToDeck"), pile: "shuffledDeck" },
    { label: t("playtest.returnToTopDeck"), pile: "topDeck" },
    { label: t("playtest.returnToBottomDeck"), pile: "bottomDeck" },
  ];

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
            onDropCard={(cardId, _x, _y, from) => {
              moveCardToPile(cardId, from, "extra");
            }}
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
            onDropCard={(cardId: string, x: number, y: number, from: DraggableZone) => moveCardBetweenZones(cardId, from, "table", x, y)}
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
                  handleContextMenu(e, card.id, "table")
                }
                draggableZone="table"
              />
            ))}
          </DropZone>
        </DisplayCard>

        {/* Hand */}
        <DisplayCard
          sx={{
            m: 2,
            position: "relative",
            border: "2px solid #888",
            overflow: "hidden",
          }}
        >
          <DropZone
            onDropCard={(cardId: string, x: number, y: number, from: DraggableZone) => moveCardBetweenZones(cardId, from, "hand", x, y)}
            isVisibleAfterDrop
            sx={{
              minHeight: 180,
              width: '100%',
              position: "relative",
              overflow: "hidden",
            }}
          >
            {hand.map((card) => (
              <CardDetailsImage
                key={card.id}
                id={card.id}
                card={card.card}
                sx={{
                  width: 140,
                  cursor: "grab",
                  position: "absolute",

                  top: card.y,
                  left: card.x,
                }}
                onContextMenu={(e: React.MouseEvent) =>
                  handleContextMenu(e, card.id, "hand")
                }
                draggableZone="hand"
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
          onClick={drawCardToHand}
          sx={{ mt: 2 }}
        />
        <Button text={t("playtest.shuffle")} onClick={shuffle} sx={{ mt: 2 }} />

        <DropZone
          label={t("common.deck")}
          onDropCard={(cardId, _x, _y, from) => {
            moveCardToPile(cardId, from, "topDeck");
          }}
          onclick={showPopover("Deck")}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: deck.length })}
        </DropZone>

        <DropZone
          label={t("playtest.discard")}
          onDropCard={(cardId, _x, _y, from) => {
            moveCardToPile(cardId, from, "discard");
          }}
          onclick={showPopover("Discard")}
          sx={{ mt: 2 }}
        >
          {t("decklist.cardCount", { count: discardPile.length })}
        </DropZone>
        <DropZone
          label={t("playtest.exile")}
          onDropCard={(cardId, _x, _y, from) => {
            moveCardToPile(cardId, from, "exile");
          }}
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
        {/* Rotate options only for table cards */}
        {contextMenu?.zone === "table" && [
          <MenuItem
            key="rotateRight"
            onClick={() => {
              if (contextMenu?.cardId) rotateCard(contextMenu.cardId, 90);
              handleCloseContextMenu();
            }}
          >
            {t("playtest.rotateRight")}
          </MenuItem>,
          <MenuItem
            key="rotateLeft"
            onClick={() => {
              if (contextMenu?.cardId) rotateCard(contextMenu.cardId, -90);
              handleCloseContextMenu();
            }}
          >
            {t("playtest.rotateLeft")}
          </MenuItem>,
          <Divider key="divider" />,
        ]}

        {/* Return options */}
        {returnActions.map(action => (
          <MenuItem
            key={action.pile}
            onClick={() => {
              if (contextMenu?.cardId) {
                moveCardToPile(contextMenu.cardId, contextMenu.zone, action.pile);
              }
              handleCloseContextMenu();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
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
