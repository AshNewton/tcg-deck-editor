import React from "react";

import CollapsibleDropdown from "./mui/CollapsibleDropdown";
import Image from "./mui/Image";
import Text from "./mui/Text";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MuiCard from "@mui/material/Card";
import ReplayIcon from "@mui/icons-material/Replay";

import { getCard, getCardHandSize, getCardImage, isMTG } from "../util/util";
import { getStartingHand, getChanceToOpenCards } from "../util/deckAnalytics";
import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Card, CardOpeningProbabilities } from "../../types";
import { getLandProbabilities } from "../util/mtg";

const StartingHand = () => {
  const [sampleStartingHand, setSampleStartingHand] = React.useState<
    Array<string>
  >([]);
  const [chanceToOpenCards, setChanceToOpenCards] =
    React.useState<CardOpeningProbabilities>([]);
  const [chanceToOpenLands, setChanceToOpenLands] = React.useState<
    Array<number>
  >([]);

  const maindeck = useAppSelector((state) => state.ui.maindeck);

  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    setSampleStartingHand([]);
    setChanceToOpenCards([]);
    setChanceToOpenLands([]);
  }, [game]);

  const handSize = getCardHandSize(game);

  React.useEffect(() => {
    if (maindeck.length > 0) {
      const sortedChances = getChanceToOpenCards(maindeck, handSize).sort(
        (a, b) => a.name.localeCompare(b.name)
      );
      setChanceToOpenCards(sortedChances);

      setChanceToOpenLands(getLandProbabilities(maindeck));
    }
  }, [maindeck, handSize]);

  const generateOpeningHand = () => {
    setSampleStartingHand(getStartingHand(maindeck, handSize).sort());
  };

  const toggleSelectedCard = (card?: Card) => {
    dispatch(setSelectedCard(card || null));
  };

  const mtg = isMTG(game);

  return (
    <MuiCard
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        m: 2,
        p: 2,
      }}
    >
      <CollapsibleDropdown
        title="Get a Sample Starting Hand"
        onOpen={generateOpeningHand}
        onCollapse={() => {
          setSampleStartingHand([]);
        }}
      >
        {sampleStartingHand && (
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {sampleStartingHand.map((cardname, index) => (
              <Image
                key={index}
                src={getCardImage(cardname, maindeck, game)}
                alt={cardname}
                maxWidth={100 / handSize + "%"}
                onClick={() => toggleSelectedCard(getCard(cardname, maindeck))}
              />
            ))}
          </Box>
        )}
        <IconButton onClick={generateOpeningHand}>
          <ReplayIcon />
        </IconButton>
      </CollapsibleDropdown>

      <CollapsibleDropdown title="Calculate Probability to Open Cards">
        {chanceToOpenCards && (
          <Grid container>
            {chanceToOpenCards.map((card, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Text text={`${card.name}: ${card.chance}`} />
              </Grid>
            ))}
          </Grid>
        )}
      </CollapsibleDropdown>

      {mtg && (
        <CollapsibleDropdown title="Number of Lands">
          {chanceToOpenCards && (
            <Grid container>
              {chanceToOpenLands.map((chance: number, index: number) => (
                <Grid item xs={12} key={index}>
                  <Text text={`${index} Land:   ${chance}%`} />
                </Grid>
              ))}
            </Grid>
          )}
        </CollapsibleDropdown>
      )}
    </MuiCard>
  );
};

export default StartingHand;
