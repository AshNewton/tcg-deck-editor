import Decklist from "../components/Decklist";
import SaveLoad from "../components/SaveLoad";
import SearchBar from "../components/Searchbar";

import Box from "@mui/material/Box";

import { searchCard } from "../api/ygoprodeck";

const Sidebar = (props) => {
  const { maindeck, setMaindeck, extradeck, setExtradeck } = props;

  const removeCopy = (cardname, deck, setDeck) => {
    setDeck(
      deck
        .map((card) =>
          card.name === cardname ? { ...card, copies: card.copies - 1 } : card
        )
        .filter((card) => card.copies > 0)
    );
  };

  const addCopy = (cardname, deck, setDeck) => {
    setDeck(
      deck.map((card) =>
        card.name === cardname ? { ...card, copies: card.copies + 1 } : card
      )
    );
  };

  const addToDeck = (newCard) => {
    // if card is already in deck, add a copy
    if (maindeck.find((card) => card.name === newCard.name)) {
      addCopy(newCard.name, maindeck, setMaindeck);
    } else if (extradeck.find((card) => card.name === newCard.name)) {
      addCopy(newCard.name, extradeck, setExtradeck);
    } else {
      // card not already in deck, add it to main or extra based on type
      if (
        newCard.details.type === "Fusion Monster" ||
        newCard.details.type === "XYZ Monster" ||
        newCard.details.type === "Synchro Monster" ||
        newCard.details.type === "Link Monster"
      ) {
        setExtradeck([...extradeck, { ...newCard, copies: 1 }]);
      } else {
        setMaindeck([...maindeck, { ...newCard, copies: 1 }]);
      }
    }
  };

  const removeFromDeck = (cardname, deck, setDeck) => {
    setDeck(
      deck
        .map((card) => (card.name === cardname ? { ...card, copies: 0 } : card))
        .filter((card) => card.copies > 0)
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
          { setter: setMaindeck, getter: maindeck, name: "main" },
          { setter: setExtradeck, getter: extradeck, name: "extra" },
        ]}
      />

      {/* display decklist and change copies */}
      <Decklist
        deckname="Main Deck"
        deck={maindeck}
        onDeckUpdate={setMaindeck}
        onAddCopy={(cardname) => addCopy(cardname, maindeck, setMaindeck)}
        onRemoveCopy={(cardname) => removeCopy(cardname, maindeck, setMaindeck)}
        onDelete={removeFromDeck}
      />

      <Decklist
        deckname="Extra Deck"
        deck={extradeck}
        onDeckUpdate={setExtradeck}
        onAddCopy={(cardname) => addCopy(cardname, extradeck, setExtradeck)}
        onRemoveCopy={(cardname) =>
          removeCopy(cardname, extradeck, setExtradeck)
        }
        onDelete={removeFromDeck}
      />
    </Box>
  );
};

export default Sidebar;
