import Decklist from "../components/Decklist";
import SaveLoad from "../components/mui/SaveLoad";
import SearchBar from "../components/mui/Searchbar";

import MuiCard from "@mui/material/Card";

import { addToDeckHandlers, isYugioh } from "../util/util";
import { searchCard as searchYGOCard } from "../api/ygoprodeck";
import { searchCard as searchMTGCard } from "../api/magicthegathering";
import { setMainDeck, setExtraDeck } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Action } from "@reduxjs/toolkit";
import { Card, Deck } from "../../types";

const Sidebar = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const addToDeck = (newCard: Card) => {
    const handler = addToDeckHandlers[game];

    if (!handler) {
      console.warn(`No handler defined for game: ${game}`);
      return;
    }

    handler(newCard, maindeck, extradeck, dispatch);
  };

  const handleDeckUpdate = (actionCreator: (deck: Deck) => Action) => {
    return (deck: Deck) => {
      dispatch(actionCreator(deck));
    };
  };

  const yugioh = isYugioh(game);

  return (
    <MuiCard>
      {/* search for cards */}
      <SearchBar
        onSearch={yugioh ? searchYGOCard : searchMTGCard}
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
        deckname={yugioh ? "Main Deck" : "Deck"}
        deck={maindeck}
        onDeckUpdate={handleDeckUpdate(setMainDeck)}
      />

      {yugioh && (
        <Decklist
          deckname="Extra Deck"
          deck={extradeck}
          onDeckUpdate={handleDeckUpdate(setExtraDeck)}
        />
      )}
    </MuiCard>
  );
};

export default Sidebar;
