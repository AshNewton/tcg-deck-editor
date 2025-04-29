import CardPreview from "./CardPreview";
import Text from "./Text";

import Box from "@mui/material/Box";

import { getDeckSize } from "../util/deckAnalytics";

const Decklist = (props) => {
  const {
    deckname,
    deck,
    onDeckUpdate,
    onAddCopy,
    onRemoveCopy,
    onDelete,
    selectedCard,
    setSelectedCard,
  } = props;

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

      {deck.map((card) => (
        <CardPreview
          key={card.name}
          card={card}
          onDelete={() => onDelete(card.name, deck, onDeckUpdate)}
          onAddCopy={() => onAddCopy(card.name, deck, onDeckUpdate)}
          onRemoveCopy={() => onRemoveCopy(card.name, deck, onDeckUpdate)}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      ))}
    </>
  );
};

export default Decklist;
