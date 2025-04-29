import Button from "../components/Button";
import Text from "../components/Text";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MuiButton from "@mui/material/Button";

const CardPreview = (props) => {
  const {
    card,
    onDelete,
    onAddCopy,
    onRemoveCopy,
    selectedCard,
    setSelectedCard,
  } = props;

  const toggleSelectedCard = () => {
    setSelectedCard(
      selectedCard?.details?.name === card.details?.name ? null : card
    );
  };

  const handleInnerClick = (e, onClick) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <MuiButton
      variant="outlined"
      sx={{
        mt: 1,
        ml: 2,
        borderRadius: 4,
        display: "flex",
        justifyContent: "left",
        gap: 1,
        width: "100%",
      }}
      onClick={toggleSelectedCard}
    >
      <IconButton
        onClick={(e) => handleInnerClick(e, onDelete)}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
      <Button
        text="-"
        onClick={(e) => handleInnerClick(e, onRemoveCopy)}
        size="small"
        aria-label="remove copy"
      />
      <Text text={card.copies} />
      <Button
        text="+"
        disabled={card.copies === 3}
        onClick={(e) => handleInnerClick(e, onAddCopy)}
        size="small"
        aria-label="add copy"
      />
      <Text text={card.name} noWrap />
    </MuiButton>
  );
};

export default CardPreview;
