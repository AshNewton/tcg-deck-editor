import { useTranslation } from "react-i18next";

import DeckbuildOptions from "../components/DeckbuildOptions";
import Decklist from "../components/Decklist";
import Text from "../components/mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";

import { isInvalidHandlers, isYugioh } from "../util/util";

import { setMainDeck, setExtraDeck } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Action } from "@reduxjs/toolkit";
import { Deck } from "../../types";

const Sidebar = () => {
  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const handleDeckUpdate = (actionCreator: (deck: Deck) => Action) => {
    return (deck: Deck) => {
      dispatch(actionCreator(deck));
    };
  };

  const yugioh = isYugioh(game);

  const deckErrors = isInvalidHandlers[game](t, maindeck, extradeck);

  return (
    <MuiCard>
      <DeckbuildOptions />

      {maindeck.length === 0 && extradeck.length === 0 ? (
        <Box display="flex" justifyContent="center" p={2}>
          <Text text={t("helperText.noCards")} fontSize={18} />
        </Box>
      ) : (
        <>
          {/* deck validity errors */}
          {deckErrors && (
            <>
              {Object.values(deckErrors).map((v: any, index: number) => {
                return (
                  <Alert severity="warning" sx={{ m: 2 }} key={index}>
                    {v}
                  </Alert>
                );
              })}
            </>
          )}

          {/* display decklist and change copies */}
          <Decklist
            deckname={yugioh ? t("yugioh.mainDeck") : t("common.deck")}
            deck={maindeck}
            onDeckUpdate={handleDeckUpdate(setMainDeck)}
          />

          {yugioh && (
            <Decklist
              deckname={t("yugioh.extraDeck")}
              deck={extradeck}
              onDeckUpdate={handleDeckUpdate(setExtraDeck)}
            />
          )}
        </>
      )}
    </MuiCard>
  );
};

export default Sidebar;
