import React from "react";

import CollapsibleDropdown from "./mui/CollapsibleDropdown";
import DisplayCard from "./mui/DisplayCard";
import Image from "./mui/Image";
import Text from "./mui/Text";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ReplayIcon from "@mui/icons-material/Replay";

import { getCard, getCardHandSize, getCardImage, isMTG } from "../util/util";
import {
  getCardDraw,
  getStartingHand,
  getChanceToOpenCards,
} from "../util/deckAnalytics";
import { setSelectedCard } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Card, CardOpeningProbabilities } from "../../types";
import { getLandProbabilities } from "../util/mtg";
import Button from "./mui/Button";

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
  const mtg = isMTG(game);

  React.useEffect(() => {
    if (maindeck.length > 0) {
      const sortedChances = getChanceToOpenCards(maindeck, handSize).sort(
        (a, b) => a.name.localeCompare(b.name)
      );
      setChanceToOpenCards(sortedChances);

      if (mtg) {
        setChanceToOpenLands(getLandProbabilities(maindeck));
      }
    }
  }, [maindeck, handSize, mtg]);

  const generateOpeningHand = () => {
    setSampleStartingHand(getStartingHand(maindeck, handSize).sort());
  };

  const drawCard = () => {
    setSampleStartingHand(
      [
        ...sampleStartingHand,
        ...getCardDraw(maindeck, sampleStartingHand),
      ].sort()
    );
  };

  const toggleSelectedCard = (card?: Card) => {
    dispatch(setSelectedCard(card || null));
  };

  return (
    <DisplayCard>
      <CollapsibleDropdown
        title="Get a Sample Starting Hand"
        onOpen={generateOpeningHand}
        onCollapse={() => {
          setSampleStartingHand([]);
        }}
      >
        <Box display="flex" flexDirection="row">
          <Button onClick={drawCard} text="Draw Card" />
          <IconButton onClick={generateOpeningHand}>
            <ReplayIcon />
          </IconButton>
        </Box>

        {sampleStartingHand && (
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {sampleStartingHand.map((cardname, index) => (
              <Image
                key={index}
                src={getCardImage(cardname, maindeck, game) ?? ""}
                alt={cardname}
                maxWidth={100 / handSize + "%"}
                onClick={() => toggleSelectedCard(getCard(cardname, maindeck))}
              />
            ))}
          </Box>
        )}
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
    </DisplayCard>
  );
};

export default StartingHand;
