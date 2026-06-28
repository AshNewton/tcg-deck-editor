import React from "react";
import { useTranslation } from "react-i18next";

import MtgCardDetails from "./mtg/CardDetails";
import PokemonCardDetails from "./pokemon/CardDetails";
import YugiohCardDetails from "./yugioh/CardDetails";

import Button from "./mui/Button";
import DisplayCard from "./mui/DisplayCard";
import Text from "./mui/Text";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useSnackbar } from "../../context/SnackbarContext";

import { MTG_NAME } from "../util/mtg/constants";
import { YUGIOH_NAME } from "../util/yugioh/constants";
import { POKEMON_NAME } from "../util/pokemon/constants";

import { CardDbEntry } from "../../types";

const CardDetails = () => {

  const [cardDb, setCardDb] = React.useState<CardDbEntry | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const card = useAppSelector((state) => state.ui.selectedCard);

  const game = useAppSelector((state) => state.ui.game);

  const { t } = useTranslation();

  const { showMessage } = useSnackbar();

  const dispatch = useAppDispatch();

  const clearSelection = () => dispatch(setSelectedCard(null));

  const fetchData = async () => {
    try {
      if(card) {
        const cardDetails = await window.db.getCardByName(card.name);
        setCardDb(cardDetails[0] || null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [card?.name]);

  if (!card) {
    return <></>;
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress size={72} sx={{ m: 4 }} />
      </Box>
    );
  }

  return (
    <DisplayCard>
      {game === MTG_NAME && (
        <MtgCardDetails card={card} clearSelection={clearSelection} />
      )}
      {game === POKEMON_NAME && (
        <PokemonCardDetails card={card} clearSelection={clearSelection} />
      )}
      {game === YUGIOH_NAME && (
        <YugiohCardDetails card={card} clearSelection={clearSelection} />
      )}

      {/* Your Collection Management */}
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
                await window.db.addCard(card.name, game, 1);
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
    </DisplayCard>
  );
};

export default CardDetails;
