import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Button from "./mui/Button";
import CardGroup from "./CardGroup";
import CustomDragLayer from "./dnd/CustomDragLayer";
import DisplayCard from "./mui/DisplayCard";

import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

import { isExtraDeckCard } from "../util/yugioh";
import { isYugioh } from "../util/util";
import { setExtraDeck, setMainDeck } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Card, Deck, Game } from "../../types";

const groupCardsByCategory = (maindeck: Deck, extradeck: Deck, game: Game) => {
  const allCards = isYugioh(game) ? [...maindeck, ...extradeck] : [...maindeck];
  const groups = new Map<string, Card[]>();

  for (const card of allCards) {
    const category = card.category?.trim() ?? "Deck";

    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(card);
  }

  return groups;
};

const DeckOrganizer = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);
  const game = useAppSelector((state) => state.ui.game);
  const dispatch = useAppDispatch();

  const [emptyGroups, setEmptyGroups] = React.useState<Array<string>>([]);

  const cardGroups = groupCardsByCategory(maindeck, extradeck, game);

  const allGroupNames = Array.from(
    new Set([...Array.from(cardGroups.keys()), ...emptyGroups])
  ).sort((a, b) => a.localeCompare(b));

  const groups = allGroupNames.map((name) => ({
    id: name,
    name,
    cards: cardGroups.get(name) ?? [],
  }));

  const moveCard = (card: Card, toGroupId: string) => {
    const updatedCard = { ...card, category: toGroupId };

    dispatch((dispatch, getState) => {
      const state = getState();
      const currentMain = state.ui.maindeck;
      const currentExtra = state.ui.extradeck;

      if (isExtraDeckCard(card)) {
        dispatch(
          setExtraDeck(
            currentExtra.map((c) =>
              c.name === updatedCard.name ? updatedCard : c
            )
          )
        );
      } else {
        dispatch(
          setMainDeck(
            currentMain.map((c) =>
              c.name === updatedCard.name ? updatedCard : c
            )
          )
        );
      }
    });
  };

  const renameGroup = (oldName: string, newName: string) => {
    const updateCategory = (deck: Deck) =>
      deck.map((card) =>
        !card.category || card.category === oldName
          ? { ...card, category: newName }
          : card
      );

    dispatch(setMainDeck(updateCategory(maindeck)));
    if (isYugioh(game)) {
      dispatch(setExtraDeck(updateCategory(extradeck)));
    }

    setEmptyGroups(
      (prev) =>
        prev
          .map((name) => (name === oldName ? newName : name))
          .filter((name) => !allGroupNames.includes(name)) // filter duplicates
    );
  };

  const handleAddGroup = () => {
    let i = 1;
    let name = `Group ${i}`;
    while (allGroupNames.includes(name)) {
      i++;
      name = `Group ${i}`;
    }
    setEmptyGroups((prev) => [...prev, name]);
  };

  const handleRemoveGroup = (name: string) => {
    const clearCategory = (deck: Deck) =>
      deck.map((card) =>
        card.category === name ? { ...card, category: "" } : card
      );

    dispatch(setMainDeck(clearCategory(maindeck)));
    if (isYugioh(game)) {
      dispatch(setExtraDeck(clearCategory(extradeck)));
    }

    setEmptyGroups((prev) => prev.filter((n) => n !== name));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DisplayCard>
        <Button onClick={handleAddGroup} text="Add Group" />
        <Box sx={{ width: "100%" }}>
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 5 }} spacing={2}>
            {groups.map((group) => (
              <CardGroup
                key={group.name}
                id={group.name}
                name={group.name}
                cards={group.cards}
                onDrop={moveCard}
                onRename={renameGroup}
                onRemove={handleRemoveGroup}
              />
            ))}
          </Masonry>
        </Box>
      </DisplayCard>
      <CustomDragLayer />
    </DndProvider>
  );
};

export default DeckOrganizer;
