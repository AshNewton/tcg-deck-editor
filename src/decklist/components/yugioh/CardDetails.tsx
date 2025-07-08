import ExternalLink from "../mui/ExternalLink";
import Image from "../mui/Image";
import Text from "./../mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import { getBannedSeverity, getCardLevelName } from "../../util/yugioh";

import { Card, ygoCard } from "../../../types";

type Props = {
  card: Card;
  clearSelection: () => void;
};

const CardDetails = (props: Props) => {
  const { card, clearSelection } = props;

  const ygoCard = card?.details as ygoCard;

  const cardLevelName = getCardLevelName(ygoCard);

  const banSeverity = getBannedSeverity(ygoCard?.banlist_info?.ban_tcg);

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
          {ygoCard.banlist_info?.ban_tcg && (
            <Alert variant="filled" severity={banSeverity} color={banSeverity}>
              {ygoCard.banlist_info.ban_tcg}
            </Alert>
          )}
        </Box>

        <IconButton onClick={clearSelection} aria-label="clear selected card">
          <ClearIcon />
        </IconButton>
      </Box>
      <Grid container gap={1} display="flex" alignItems="center">
        <Grid item xs={12} sm={3}>
          <Image src={ygoCard.card_images[0]?.image_url} alt={card.name} />
        </Grid>
        <Grid item xs={12} sm={8} mt={2} px={2} py={1}>
          {/* level/rank/link rating */}
          {ygoCard.level && (
            <Text text={`${cardLevelName}: ${ygoCard.level}`} />
          )}

          {/* attribute */}
          {ygoCard.attribute && ygoCard.race && (
            <Text mt={1} text={`${ygoCard.attribute} / ${ygoCard.race}`} />
          )}

          {/* type */}
          <Text text={`${ygoCard.humanReadableCardType}`} />

          {/* ATK/DEF */}
          {ygoCard.atk != null && ygoCard.def != null && (
            <Text mt={1} text={`ATK: ${ygoCard.atk} / DEF: ${ygoCard.def}`} />
          )}

          {/* card text */}
          <Text mt={1} text={`${ygoCard.desc}`} />

          {/* link to YGOPRO */}
          <ExternalLink
            mt={1}
            href={ygoCard.ygoprodeck_url}
            label="YGOPRODECK"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CardDetails;
