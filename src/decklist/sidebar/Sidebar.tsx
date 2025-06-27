import Decklist from "../components/Decklist";
import SaveLoad, { loadFile, saveFile } from "../components/mui/SaveLoad";
import SearchBar from "../components/mui/Searchbar";
import Text from "../components/mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";

import {
  addToDeckHandlers,
  isInvalidHandlers,
  isMTG,
  isYugioh,
} from "../util/util";
import {
  bulkSearchCard as bulkSearchYgoCard,
  searchCard as searchYGOCard,
} from "../api/ygoprodeck";
import {
  bulkSearchCard,
  bulkSearchCard as bulkSearchMtgCard,
  searchCard as searchMTGCard,
} from "../api/magicthegathering";

import { isExtraDeckCard, isYgoCard } from "../util/yugioh";
import { isMtgCard } from "../util/mtg";
import { isPokemonCard } from "../util/pokemon";
import { searchCard as searchPokemonCard } from "../api/pokemontcgio";
import { setMainDeck, setExtraDeck } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { NEW_LINE, TXT_OPTS } from "../util/constants";

import { Action } from "@reduxjs/toolkit";
import { Card, Deck, mtgCard } from "../../types";

type ParsedCardLine = {
  copies: number;
  name: string;
};

const parseCardLine = (line: string): ParsedCardLine | null => {
  const parts = line.trim().split(" ");

  // First part should be something like '1x'
  const copiesPart = parts[0];
  if (!copiesPart.endsWith("x")) return null;

  const copies = parseInt(copiesPart.slice(0, -1), 10);
  if (isNaN(copies)) return null;

  // Find the index of the part that starts the set code (like '(clb)')
  const setCodeIndex = parts.findIndex(
    (part) => part.startsWith("(") && part.endsWith(")")
  );
  if (setCodeIndex === -1) return null;

  // The name is everything between the copies part and the set code part
  const nameParts = parts.slice(1, setCodeIndex);
  const name = nameParts.join(" ");

  return {
    copies,
    name,
  };
};

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
  const mtg = isMTG(game);

  const deckErrors = isInvalidHandlers[game](maindeck, extradeck);

  const handleExportTabletopSim = () => {
    const exportContent = maindeck.reduce((acc, card) => {
      const mtgCard = card.details as mtgCard;

      return acc + `${card.copies}x ${card.name} (${mtgCard.set}) ${NEW_LINE}`;
    }, "");

    saveFile(exportContent, TXT_OPTS);
  };

  const handleArchidektImport = () => {
    loadFile(handleLoad);
  };

  const handleLoad = async (text: string) => {
    // get names and copies out of file
    const parsedCards = text.split(NEW_LINE).map((line: string) => {
      return parseCardLine(line);
    });

    // bulk search scryfall and get all the cards into a deck
    const singletonDeck = await bulkSearchCard(
      parsedCards.map((card: ParsedCardLine | null) => {
        return card ? card.name : "";
      })
    );

    // put the right number of copies of each card into the deck,
    // defaulting to 1 copy
    const deck = singletonDeck.map((card: Card) => {
      return {
        ...card,
        copies:
          parsedCards.filter((c: ParsedCardLine | null) => {
            return c?.name === card.name;
          })[0]?.copies ?? 1,
      };
    });

    dispatch(setMainDeck(deck));
  };

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
        validateCard={yugioh ? isYgoCard : mtg ? isMtgCard : isPokemonCard}
        menuActions={
          mtg
            ? [
                {
                  label: "Export for Tabletop Simulator",
                  onClick: handleExportTabletopSim,
                  disabled: maindeck.length === 0,
                },
                {
                  label: "Import from Archidekt",
                  onClick: handleArchidektImport,
                },
              ]
            : []
        }
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
