import React from "react";

import { useSnackbar } from "../../../context/SnackbarContext";
import { useTranslation } from "react-i18next";

import Button from "../mui/Button";
import ExternalLink from "../mui/ExternalLink";
import Image from "../mui/Image";
import Text from "./../mui/Text";
import TextWithSymbols from "../mui/TextWithSymbols";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import { getSymbolUris } from "../../api/magicthegathering";

import { Card, CardDbEntry, mtgCard, MtgSymbol } from "../../../types";
import { MTG_NAME } from "../../util/mtg/constants";

type Props = {
  card: Card;
  clearSelection: () => void;
};

const CardDetails = (props: Props) => {
  const { card, clearSelection } = props;

  const [cardDb, setCardDb] = React.useState<CardDbEntry | null>(null);
  const [symbols, setSymbols] = React.useState<Array<MtgSymbol>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { t } = useTranslation();

  const { showMessage } = useSnackbar();

  const fetchData = async () => {
    try {
      const cardDetails = await window.db.getCardByName(card.name);
      setCardDb(cardDetails[0] || null);

      const symbols = await getSymbolUris();
      setSymbols(symbols);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [card.name]);

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

        <IconButton onClick={clearSelection} aria-label={t("common.clear")}>
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
              <Text
                mt={1}
                text={t("common.slashSeparated", {
                  first: mtgCard.power,
                  second: mtgCard.toughness,
                })}
              />
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
                      <Text
                        mt={1}
                        text={t("mtg.powerToughness", {
                          power: face.power,
                          toughness: face.toughness,
                        })}
                      />
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
          <ExternalLink
            mt={2}
            href={mtgCard.scryfall_uri}
            label={t("mtg.scryfall")}
          />

             
          <Text
            mt={2}
            text={t("database.yourCollection")}
          />   
          <Box display="flex" flexDirection="row" alignItems="center" gap={2} mt={1}>
            {/* add to db */}
            {cardDb === null && (
              <Button 
                text={t("database.addCard")}
                onClick={async () => {
                    await window.db.addCard(mtgCard.name, MTG_NAME, 1);
                    showMessage(t("database.cardAdded"), "success");

                    fetchData();
                }}/>
            )}

            {/* delete from db or change number copies */}
            {cardDb !== null && (
                <>
                  <Button 
                    text={t("database.deleteCard")}
                    onClick={async () => {
                        await window.db.deleteCard(cardDb.id);
                        showMessage(t("database.cardDeleted"), "success");

                        fetchData();
                     }}
                    />

                    <Button 
                      text={t("database.removeCopy")}
                      disabled={cardDb?.copies <= 1}
                      onClick={async () => {
                          await window.db.removeCopy(cardDb.id, 1);
                          fetchData();
                      }}
                    />

                    <Text text={`${cardDb?.copies}`} fontSize={20} />

                    <Button 
                    text={t("database.addCopy")}
                    onClick={async () => {
                        await window.db.addCopy(cardDb.id, 1);
                        fetchData();
                      }}
                    />
                </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CardDetails;
