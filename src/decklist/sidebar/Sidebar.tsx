import React from "react";

import Decklist from "../components/Decklist";
import SaveLoad from "../components/SaveLoad";
import SearchBar from "../components/Searchbar";

import Box from "@mui/material/Box";

import { searchCard } from "../api/ygoprodeck";
import { setMainDeck, setExtraDeck } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Card, Deck } from "../../types";
import { Action } from "@reduxjs/toolkit";

const Sidebar = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const dispatch = useAppDispatch();

  const addToDeck = (newCard: Card) => {
    // if card is already in deck, add a copy
    if (maindeck.find((card) => card.name === newCard.name)) {
      const updatedDeck = maindeck.map((card) =>
        card.name === newCard.name ? { ...card, copies: card.copies + 1 } : card
      );

      dispatch(setMainDeck(updatedDeck));
    } else if (extradeck.find((card) => card.name === newCard.name)) {
      const updatedDeck = extradeck.map((card) =>
        card.name === newCard.name ? { ...card, copies: card.copies + 1 } : card
      );

      dispatch(setExtraDeck(updatedDeck));
    } else {
      // card not already in deck, add it to main or extra based on type
      if (
        newCard.details.type === "Fusion Monster" ||
        newCard.details.type === "XYZ Monster" ||
        newCard.details.type === "Synchro Monster" ||
        newCard.details.type === "Link Monster"
      ) {
        dispatch(setExtraDeck([...extradeck, { ...newCard, copies: 1 }]));
      } else {
        dispatch(setMainDeck([...maindeck, { ...newCard, copies: 1 }]));
      }
    }
  };

  const handleDeckUpdate = (actionCreator: (deck: Deck) => Action) => {
    return (deck: Deck) => {
      dispatch(actionCreator(deck));
    };
  };

  return (
    <Box
      sx={{
        border: "1px solid black",
        padding: 2,
      }}
    >
      {/* search for cards */}
      <SearchBar
        onSearch={searchCard}
        renderOption={(card) => card.name}
        onOptionSelect={(card) => addToDeck(card)}
      />

      {/* save/load decklists */}
      <SaveLoad
        saveload={[
          { setter: setMainDeck, getter: maindeck, name: "main" },
          { setter: setExtraDeck, getter: extradeck, name: "extra" },
        ]}
      />

      {/* display decklist and change copies */}
      <Decklist
        deckname="Main Deck"
        deck={maindeck}
        onDeckUpdate={handleDeckUpdate(setMainDeck)}
      />

      <Decklist
        deckname="Extra Deck"
        deck={extradeck}
        onDeckUpdate={handleDeckUpdate(setExtraDeck)}
      />
    </Box>
  );
};

export default Sidebar;
