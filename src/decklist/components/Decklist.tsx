import CardPreview from "./CardPreview";
import MtgDecklist from "./mtg/Decklist";
import Text from "./mui/Text";

import Box from "@mui/material/Box";

import { getDeckSize } from "../util/deckAnalytics";
import { useAppSelector } from "../../hooks";

import { MTG_NAME } from "../util/mtg";

import { Deck } from "../../types";

type Props = {
  deckname: string;
  deck: Deck;
  onDeckUpdate: (deck: Deck) => void;
};

const Decklist = (props: Props) => {
  const { deckname, deck, onDeckUpdate } = props;

  const game = useAppSelector((state) => state.ui.game);

  const removeFromDeck = (cardname: string) => {
    const updatedDeck = deck
      .map((card) => (card.name === cardname ? { ...card, copies: 0 } : card))
      .filter((card) => card.copies > 0);

    onDeckUpdate(updatedDeck);
  };

  const removeCopy = (cardname: string) => {
    const updatedDeck = deck
      .map((card) =>
        card.name === cardname ? { ...card, copies: card.copies - 1 } : card
      )
      .filter((card) => card.copies > 0);

    onDeckUpdate(updatedDeck);
  };

  const addCopy = (cardname: string) => {
    const updatedDeck = deck.map((card) =>
      card.name === cardname ? { ...card, copies: card.copies + 1 } : card
    );

    onDeckUpdate(updatedDeck);
  };

  return (
    <>
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={2}
        px={2}
        py={1}
      >
        <Text text={deckname} fontSize={28} />
        <Text text={`(Cards: ${getDeckSize(deck)})`} />
      </Box>

      {game === MTG_NAME ? (
        <MtgDecklist
          deck={deck}
          onDelete={removeFromDeck}
          onAddCopy={addCopy}
          onRemoveCopy={removeCopy}
        />
      ) : (
        deck.map((card) => (
          <CardPreview
            key={card.name}
            card={card}
            onDelete={removeFromDeck}
            onAddCopy={addCopy}
            onRemoveCopy={removeCopy}
          />
        ))
      )}
    </>
  );
};

export default Decklist;
