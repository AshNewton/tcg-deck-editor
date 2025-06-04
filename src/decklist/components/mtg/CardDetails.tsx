import React from "react";

import Text from "./../mui/Text";
import TextWithSymbols from "./TextWithSymbols";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

import { Card, MtgSymbol } from "../../../types";
import { getSymbolUris } from "../../api/magicthegathering";

type Props = {
  card: Card;
  clearSelection: () => void;
};

const CardDetails = (props: Props) => {
  const { card, clearSelection } = props;

  const [symbols, setSymbols] = React.useState<Array<MtgSymbol>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchData = async () => {
    try {
      const result = await getSymbolUris();
      setSymbols(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress size={72} sx={{ m: 4 }} />
      </Box>
    );
  }

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
        {/* Name , copies */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Text text={card.name} fontSize={28} />
          {card.copies > 1 && <Text text={`x${card.copies}`} fontSize={20} />}
        </Box>

        <IconButton onClick={clearSelection} aria-label="clear selected card">
          <ClearIcon />
        </IconButton>
      </Box>

      <Box mt={2} display="flex" flexDirection="column" px={2} py={1}>
        {/* mana */}
        {!card.details.card_faces && (
          <TextWithSymbols text={card.details.mana_cost} symbols={symbols} />
        )}

        {/* type */}
        {!card.details.card_faces && (
          <Text text={`${card.details.type_line}`} />
        )}

        {/* power/toughness */}
        {!card.details.card_faces &&
          card.details.power != null &&
          card.details.toughness != null && (
            <Text
              mt={1}
              text={`${card.details.power} / ${card.details.toughness}`}
            />
          )}

        {/* card text */}
        {!card.details.card_faces && card.details.oracle_text && (
          <TextWithSymbols text={card.details.oracle_text} symbols={symbols} />
        )}

        {/* card text for multiple faces */}
        {card.details.card_faces && (
          <Grid container>
            {card.details.card_faces.map((face: any) => {
              return (
                <Grid sm={6} xs={12}>
                  <Text mt={1} text={`${face.name}`} />

                  {/* mana */}
                  <TextWithSymbols text={face.mana_cost} symbols={symbols} />

                  {/* type */}
                  <Text text={`${face.type_line}`} />

                  {/* power/toughness */}
                  {face.power != null && face.toughness != null && (
                    <Text mt={1} text={`${face.power} / ${face.toughness}`} />
                  )}

                  <TextWithSymbols text={face.oracle_text} symbols={symbols} />
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* link to Scryfall */}
        <Link
          mt={1}
          href={card.details.scryfall_uri}
          target="_blank"
          rel="noopener noreferrer"
        >
          Scryfall
        </Link>
      </Box>
    </>
  );
};

export default CardDetails;
