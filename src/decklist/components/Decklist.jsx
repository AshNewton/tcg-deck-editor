import Button from "../components/Button";
import Text from "../components/Text";

import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const Decklist = (props) => {
  const { deckname, deck, onDeckUpdate, onAddCopy, onRemoveCopy, onDelete } =
    props;

  return (
    <>
      <Text text={deckname} mt={2} />
      {deck.map((card) => (
        <Box
          key={card.name}
          ml={2}
          mt={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={2}
        >
          <IconButton
            onClick={() => onDelete(card.name, deck, onDeckUpdate)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>

          <Button
            text="-"
            onClick={() => onRemoveCopy(card.name, deck, onDeckUpdate)}
          />
          <Text text={card.copies} />
          <Button
            text="+"
            disabled={card.copies === 3}
            onClick={() => onAddCopy(card.name, deck, onDeckUpdate)}
          />
          <Text text={card.name} noWrap />
        </Box>
      ))}
    </>
  );
};

export default Decklist;
