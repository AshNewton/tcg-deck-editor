import Text from "./Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

const CardDetails = (props) => {
  const { card, onCardDeselect } = props;

  const getBannedSeverity = (banType) => {
    switch (banType) {
      case "Forbidden":
        return "error";
      case "Limited":
        return "warning";
      case "Semi-Limited":
        return "warning";
      default:
        return "success";
    }
  };

  const cardLevelName =
    card.details.type === "Link Monster"
      ? "Link Rating"
      : card.details.type === "XYZ Monster"
      ? "Rank"
      : "Level";

  return (
    <Box
      sx={{
        border: "1px solid black",
        padding: 2,
      }}
    >
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1}
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Text text={card.name} fontSize={28} />
          {card.copies > 1 && <Text text={`x${card.copies}`} fontSize={20} />}
          {card.details.banlist_info?.ban_tcg && (
            <Alert
              variant="filled"
              severity={getBannedSeverity(card.details.banlist_info?.ban_tcg)}
              color={getBannedSeverity(card.details.banlist_info?.ban_tcg)}
            >
              {card.details.banlist_info.ban_tcg}
            </Alert>
          )}
        </Box>

        <IconButton onClick={onCardDeselect} aria-label="clear selected card">
          <ClearIcon />
        </IconButton>
      </Box>

      <Box mt={2} display="flex" flexDirection="column" px={2} py={1}>
        {card.details.level && (
          <Text text={`${cardLevelName}: ${card.details.level}`} />
        )}

        {card.details.attribute && card.details.race && (
          <Text
            mt={1}
            text={`${card.details.attribute} / ${card.details.race}`}
          />
        )}
        <Text text={`${card.details.humanReadableCardType}`} />

        {card.details.atk != null && card.details.def != null && (
          <Text
            mt={1}
            text={`ATK: ${card.details.atk} / DEF: ${card.details.def}`}
          />
        )}

        <Text mt={1} text={`${card.details.desc}`} />

        <Link
          mt={1}
          href={card.details.ygoprodeck_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          YGOPRODECK
        </Link>
      </Box>
    </Box>
  );
};

export default CardDetails;
