import Decklist from "../components/Decklist";
import SaveLoad from "../components/mui/SaveLoad";
import SearchBar from "../components/mui/Searchbar";
import Text from "../components/mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";

import { addToDeckHandlers, isInvalidHandlers, isYugioh } from "../util/util";
import {
  bulkSearchCard as bulkSearchYgoCard,
  searchCard as searchYGOCard,
} from "../api/ygoprodeck";
import {
  bulkSearchCard as bulkSearchMtgCard,
  searchCard as searchMTGCard,
} from "../api/magicthegathering";

import { isExtraDeckCard, isYgoCard } from "../util/yugioh";
import { searchCard as searchPokemonCard } from "../api/pokemontcgio";
import { setMainDeck, setExtraDeck } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Action } from "@reduxjs/toolkit";
import { Card, Deck } from "../../types";
import { isMtgCard } from "../util/mtg";

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

  const bulkAddToDeck = async (bulkText: string) => {
    const lines = bulkText.split(/\r?\n/).filter((line) => Boolean(line));

    const deck = yugioh
      ? await bulkSearchYgoCard(lines)
      : await bulkSearchMtgCard(lines);

    const handler = addToDeckHandlers[game];

    if (!handler) {
      console.warn(`No handler defined for game: ${game}`);
      return;
    }

    const newMaindeck = deck.filter((card: Card) => !isExtraDeckCard(card));
    const newExtradeck = deck.filter((card: Card) => isExtraDeckCard(card));

    handler(null, newMaindeck, newExtradeck, dispatch);
  };

  const handleDeckUpdate = (actionCreator: (deck: Deck) => Action) => {
    return (deck: Deck) => {
      dispatch(actionCreator(deck));
    };
  };

  const yugioh = isYugioh(game);
  const mtg = isMtgCard(game);

  const deckErrors = isInvalidHandlers[game](maindeck, extradeck);

  return (
    <MuiCard>
      {/* search for cards */}
      <SearchBar
        onSearch={
          yugioh ? searchYGOCard : mtg ? searchMTGCard : searchPokemonCard
        }
        renderOption={(card) => card.name}
        onOptionSelect={(card) => addToDeck(card)}
        onBulkSearch={yugioh || mtg ? bulkAddToDeck : undefined}
      />

      {/* save/load decklists */}
      <SaveLoad
        saveload={[
          { setter: setMainDeck, getter: maindeck, name: "main" },
          { setter: setExtraDeck, getter: extradeck, name: "extra" },
        ]}
        validateCard={yugioh ? isYgoCard : isMtgCard}
      />

      {maindeck.length === 0 && extradeck.length === 0 ? (
        <Box display="flex" justifyContent="center" p={2}>
          <Text text={"Add Some Cards!"} fontSize={18} />
        </Box>
      ) : (
        <>
          {/* deck validity errors */}
          {deckErrors && (
            <>
              {Object.values(deckErrors).map((v: any) => {
                return (
                  <Alert severity="warning" sx={{ m: 2 }}>
                    {v}
                  </Alert>
                );
              })}
            </>
          )}

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
        </>
      )}
    </MuiCard>
  );
};

export default Sidebar;
