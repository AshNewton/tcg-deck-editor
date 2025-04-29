import { useSelector, useDispatch } from "react-redux";

import Decklist from "../components/Decklist";
import SaveLoad from "../components/SaveLoad";
import SearchBar from "../components/Searchbar";

import Box from "@mui/material/Box";

import { searchCard } from "../api/ygoprodeck";
import { setMainDeck, setExtraDeck } from "../../store/slices/uiSlice";

const Sidebar = () => {
  const maindeck = useSelector((state) => state.ui.maindeck);
  const extradeck = useSelector((state) => state.ui.extradeck);

  const dispatch = useDispatch();

  const removeCopy = (cardname, deck, setDeck) => {
    dispatch(
      setDeck(
        deck
          .map((card) =>
            card.name === cardname ? { ...card, copies: card.copies - 1 } : card
          )
          .filter((card) => card.copies > 0)
      )
    );
  };

  const addCopy = (cardname, deck, setDeck) => {
    dispatch(
      setDeck(
        deck.map((card) =>
          card.name === cardname ? { ...card, copies: card.copies + 1 } : card
        )
      )
    );
  };

  const addToDeck = (newCard) => {
    // if card is already in deck, add a copy
    if (maindeck.find((card) => card.name === newCard.name)) {
      addCopy(newCard.name, maindeck, setMainDeck);
    } else if (extradeck.find((card) => card.name === newCard.name)) {
      addCopy(newCard.name, extradeck, setExtraDeck);
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

  const removeFromDeck = (cardname, deck, setDeck) => {
    dispatch(
      setDeck(
        deck
          .map((card) =>
            card.name === cardname ? { ...card, copies: 0 } : card
          )
          .filter((card) => card.copies > 0)
      )
    );
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
        onDeckUpdate={setMainDeck}
        onAddCopy={(cardname) => addCopy(cardname, maindeck, setMainDeck)}
        onRemoveCopy={(cardname) => removeCopy(cardname, maindeck, setMainDeck)}
        onDelete={removeFromDeck}
      />

      <Decklist
        deckname="Extra Deck"
        deck={extradeck}
        onDeckUpdate={setExtraDeck}
        onAddCopy={(cardname) => addCopy(cardname, extradeck, setExtraDeck)}
        onRemoveCopy={(cardname) =>
          removeCopy(cardname, extradeck, setExtraDeck)
        }
        onDelete={removeFromDeck}
      />
    </Box>
  );
};

export default Sidebar;
