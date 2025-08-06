import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Button from "./mui/Button";
import CardGroup from "./CardGroup";
import DisplayCard from "./mui/DisplayCard";

import Grid from "@mui/material/Grid";

import { isYugioh } from "../util/util";
import { useAppSelector } from "../../hooks";

import { Card, Deck } from "../../types";

type Group = {
  id: string;
  name: string;
  cards: Deck;
};

const DeckOrganizer = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const game = useAppSelector((state) => state.ui.game);

  const initialGroups: Group[] = Object.entries(
    isYugioh(game)
      ? { "Main Deck": maindeck, "Extra Deck": extradeck }
      : { Deck: maindeck }
  ).map(([key, cards]) => ({
    id: crypto.randomUUID(), // or something simpler
    name: key,
    cards,
  }));

  const [groups, setGroups] = React.useState<Array<Group>>(initialGroups);

  const moveCard = (card: Card, toGroupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        const isTarget = group.id === toGroupId;
        const hasCard = group.cards.some((c) => c.name === card.name);

        return {
          ...group,
          cards: isTarget
            ? [...group.cards, card]
            : hasCard
            ? group.cards.filter((c) => c.name !== card.name)
            : group.cards,
        };
      })
    );
  };

  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Group ${prev.length + 1}`,
        cards: [],
      },
    ]);
  };

  const renameGroup = (id: string, newName: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, name: newName } : group
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DisplayCard>
        <Button onClick={handleAddGroup} text="Add Group" />
        <Grid container>
          {groups?.map((group) => (
            <Grid item xs={12} md={4} p={1}>
              <CardGroup
                key={group.id}
                id={group.id}
                name={group.name}
                cards={group.cards}
                onDrop={moveCard}
                onRename={renameGroup}
              />
            </Grid>
          ))}
        </Grid>
      </DisplayCard>
    </DndProvider>
  );
};

export default DeckOrganizer;
