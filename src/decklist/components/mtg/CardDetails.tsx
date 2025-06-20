import React from "react";

import Image from "../mui/Image";
import Text from "./../mui/Text";
import TextWithSymbols from "../mui/TextWithSymbols";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

import { getSymbolUris } from "../../api/magicthegathering";

import { Card, mtgCard, MtgSymbol } from "../../../types";

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

  const mtgCard = card?.details as mtgCard | undefined;

  if (!mtgCard) return <></>;

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

      <Grid container mt={2} gap={1} display="flex" alignItems="center">
        <Grid item xs={12} sm={3}>
          <Image src={mtgCard.image_uris.normal} alt={card.name} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          display="flex"
          flexDirection="column"
          px={2}
          py={1}
        >
          {/* mana */}
          {!mtgCard.card_faces && (
            <TextWithSymbols text={mtgCard.mana_cost} symbols={symbols} />
          )}

          {/* type */}
          {!mtgCard.card_faces && <Text text={`${mtgCard.type_line}`} />}

          {/* power/toughness */}
          {!mtgCard.card_faces &&
            mtgCard.power != null &&
            mtgCard.toughness != null && (
              <Text mt={1} text={`${mtgCard.power} / ${mtgCard.toughness}`} />
            )}

          {/* card text */}
          {!mtgCard.card_faces && mtgCard.oracle_text && (
            <TextWithSymbols text={mtgCard.oracle_text} symbols={symbols} />
          )}

          {/* card text for multiple faces */}
          {mtgCard.card_faces && (
            <Grid container>
              {mtgCard.card_faces.map((face: any) => {
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

                    <TextWithSymbols
                      text={face.oracle_text}
                      symbols={symbols}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* link to Scryfall */}
          <Link
            mt={1}
            href={mtgCard.scryfall_uri}
            target="_blank"
            rel="noopener noreferrer"
          >
            Scryfall
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default CardDetails;
