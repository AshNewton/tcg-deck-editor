import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Button from "./mui/Button";
import CardGroup from "./CardGroup";
import DisplayCard from "./mui/DisplayCard";

import Grid from "@mui/material/Grid";

import { isYugioh } from "../util/util";
import { useAppSelector } from "../../hooks";

import { Card, Deck, Game } from "../../types";

type Group = {
  id: string;
  name: string;
  cards: Deck;
};

const getInitialGroups = (
  maindeck: Deck,
  extradeck: Deck,
  game: Game
): Array<Group> => {
  const allCards = isYugioh(game) ? [...maindeck, ...extradeck] : [...maindeck];

  const groupsMap = new Map<string, Array<Card>>();

  allCards.forEach((card) => {
    const groupName =
      card.category?.trim() ||
      (isYugioh(game) && extradeck.includes(card) ? "Extra Deck" : "Deck");

    if (!groupsMap.has(groupName)) {
      groupsMap.set(groupName, []);
    }
    groupsMap.get(groupName)!.push(card);
  });

  return Array.from(groupsMap.entries()).map(([name, cards]) => ({
    id: crypto.randomUUID(),
    name,
    cards,
  }));
};

const DeckOrganizer = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const game = useAppSelector((state) => state.ui.game);

  const [groups, setGroups] = React.useState<Array<Group>>(
    getInitialGroups(maindeck, extradeck, game)
  );

  const moveCard = (card: Card, toGroupId: string) => {
    setGroups((prevGroups) => {
      // Check if the card is already in the target group
      const targetGroup = prevGroups.find((g) => g.id === toGroupId);
      const cardAlreadyInTarget = targetGroup?.cards.some(
        (c) => c.name === card.name
      );

      // If card is already in the target group, do nothing
      if (cardAlreadyInTarget) return prevGroups;

      // Otherwise, remove from all groups and add to the target group
      return prevGroups.map((group) => {
        if (group.cards.some((c) => c.name === card.name)) {
          return {
            ...group,
            cards: group.cards.filter((c) => c.name !== card.name),
          };
        } else if (group.id === toGroupId) {
          return {
            ...group,
            cards: [...group.cards, card],
          };
        } else {
          return group;
        }
      });
    });
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

  const handleRemoveGroup = (id: string) => {
    setGroups(groups.filter((g: Group) => g.id !== id));
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
            <Grid item xs={12} md={3} p={1}>
              <CardGroup
                key={group.id}
                id={group.id}
                name={group.name}
                cards={group.cards}
                onDrop={moveCard}
                onRename={renameGroup}
                onRemove={handleRemoveGroup}
              />
            </Grid>
          ))}
        </Grid>
      </DisplayCard>
    </DndProvider>
  );
};

export default DeckOrganizer;
