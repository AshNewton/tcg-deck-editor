import React from "react";

import Text from "./mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MuiCard from "@mui/material/Card";

import { getBannedSeverity, getCardLevelName } from "../util/yugioh";
import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const CardDetails = () => {
  const card = useAppSelector((state) => state.ui.selectedCard);

  const dispatch = useAppDispatch();

  const cardLevelName = getCardLevelName(card);

  const banSeverity = getBannedSeverity(card?.details?.banlist_info?.ban_tcg);

  return (
    card && (
      <MuiCard>
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
                severity={banSeverity}
                color={banSeverity}
              >
                {card.details.banlist_info.ban_tcg}
              </Alert>
            )}
          </Box>

          <IconButton
            onClick={() => dispatch(setSelectedCard(null))}
            aria-label="clear selected card"
          >
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
      </MuiCard>
    )
  );
};

export default CardDetails;
