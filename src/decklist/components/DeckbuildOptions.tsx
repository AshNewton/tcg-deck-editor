import SaveLoad, { loadFile, saveFile } from "./mui/SaveLoad";
import SearchBar from "./mui/Searchbar";

import { addToDeckHandlers, isMTG, isYugioh } from "../util/util";
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

import { Card, mtgCard } from "../../types";

type ParsedCardLine = { copies: number; name: string };
type LineParser = (line: string) => ParsedCardLine | null;
type SupportedBuilders = "archidekt" | "goldfish";

const parseCardLineFactory = (format: SupportedBuilders): LineParser => {
  return (line: string): ParsedCardLine | null => {
    const parts = line.trim().split(" ");
    const first = parts[0];

    const copies =
      format === "archidekt" && first.endsWith("x")
        ? parseInt(first.slice(0, -1), 10)
        : parseInt(first, 10);

    if (isNaN(copies)) return null;

    const setCodeIndex = parts.findIndex(
      (p) => p.startsWith("(") && p.endsWith(")")
    );
    const nameParts =
      format === "archidekt" ? parts.slice(1, setCodeIndex) : parts.slice(1);

    return { copies, name: nameParts.join(" ") };
  };
};

const DeckbuildOptions = () => {
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

  const yugioh = isYugioh(game);
  const mtg = isMTG(game);

  const handleExportTabletopSim = () => {
    const exportContent = maindeck.reduce((acc, card) => {
      const mtgCard = card.details as mtgCard;

      return acc + `${card.copies}x ${card.name} (${mtgCard.set}) ${NEW_LINE}`;
    }, "");

    saveFile(exportContent, TXT_OPTS);
  };

  const handleDeckImport = (p: SupportedBuilders) => () => {
    loadFile(handleLoad(parseCardLineFactory(p)));
  };

  const handleLoad =
    (lineParser: (line: string) => ParsedCardLine | null) =>
    async (text: string) => {
      // get names and copies out of file
      const parsedCards = text.split(NEW_LINE).map((line: string) => {
        return lineParser(line);
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
            parsedCards.find((c: ParsedCardLine | null) => {
              return c?.name === card.name;
            })?.copies ?? 1,
        };
      });

      dispatch(setMainDeck(deck));
    };

  return (
    <>
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
                  onClick: handleDeckImport("archidekt"),
                },
                {
                  label: "Import from Moxfield",
                  onClick: handleDeckImport("goldfish"),
                },
                {
                  label: "Import from MTG Goldfish",
                  onClick: handleDeckImport("goldfish"),
                },
              ]
            : []
        }
      />
    </>
  );
};

export default DeckbuildOptions;
