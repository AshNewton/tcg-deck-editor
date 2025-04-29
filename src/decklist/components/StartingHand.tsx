import React from "react";

import Button from "./Button";
import CollapsibleDropdown from "./CollapsibleDropdown";
import Text from "./Text";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { getStartingHand, getChanceToOpenCards } from "../util/deckAnalytics";
import { useAppSelector } from "../../hooks";

import { CardOpeningProbabilities } from "../../types";

const StartingHand = () => {
  const [sampleStartingHand, setSampleStartingHand] = React.useState<
    Array<string>
  >([]);
  const [chanceToOpenCards, setChanceToOpenCards] =
    React.useState<CardOpeningProbabilities>([]);

  const maindeck = useAppSelector((state) => state.ui.maindeck);

  const generateOpeningHand = () => {
    setSampleStartingHand(getStartingHand(maindeck).sort());
  };

  const generateOpeningHandProbabilities = () => {
    setChanceToOpenCards(
      getChanceToOpenCards(maindeck).sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );
  };

  return (
    <CollapsibleDropdown title="Starting Hand">
      <Button text="Get a Sample Starting Hand" onClick={generateOpeningHand} />
      {sampleStartingHand && (
        <List>
          {sampleStartingHand.map((cardname, index) => (
            <ListItem key={index}>
              <ListItemText primary={cardname} />
            </ListItem>
          ))}
        </List>
      )}

      <Button
        text="Calculate Probability to Open Cards"
        onClick={generateOpeningHandProbabilities}
      />
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
  );
};

export default StartingHand;
