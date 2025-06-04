import Text from "./../mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

import { getBannedSeverity, getCardLevelName } from "../../util/yugioh";

import { Card } from "../../../types";

type Props = {
  card: Card;
  clearSelection: () => void;
};

const CardDetails = (props: Props) => {
  const { card, clearSelection } = props;

  const cardLevelName = getCardLevelName(card);

  const banSeverity = getBannedSeverity(card?.details?.banlist_info?.ban_tcg);

  return (
    <>
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1}
      >
        {/* Name , copies, banlist */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Text text={card.name} fontSize={28} />
          {card.copies > 1 && <Text text={`x${card.copies}`} fontSize={20} />}
          {card.details.banlist_info?.ban_tcg && (
            <Alert variant="filled" severity={banSeverity} color={banSeverity}>
              {card.details.banlist_info.ban_tcg}
            </Alert>
          )}
        </Box>

        <IconButton onClick={clearSelection} aria-label="clear selected card">
          <ClearIcon />
        </IconButton>
      </Box>

      <Box mt={2} display="flex" flexDirection="column" px={2} py={1}>
        {/* level/rank/link rating */}
        {card.details.level && (
          <Text text={`${cardLevelName}: ${card.details.level}`} />
        )}

        {/* attribute */}
        {card.details.attribute && card.details.race && (
          <Text
            mt={1}
            text={`${card.details.attribute} / ${card.details.race}`}
          />
        )}

        {/* type */}
        <Text text={`${card.details.humanReadableCardType}`} />

        {/* ATK/DEF */}
        {card.details.atk != null && card.details.def != null && (
          <Text
            mt={1}
            text={`ATK: ${card.details.atk} / DEF: ${card.details.def}`}
          />
        )}

        {/* card text */}
        <Text mt={1} text={`${card.details.desc}`} />

        {/* link to YGOPRO */}
        <Link
          mt={1}
          href={card.details.ygoprodeck_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          YGOPRODECK
        </Link>
      </Box>
    </>
  );
};

export default CardDetails;
