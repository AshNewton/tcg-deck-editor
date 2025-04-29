import * as React from "react";

import Button from "./Button";
import CollapsibleDropdown from "./CollapsibleDropdown";
import Text from "./Text";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { getStartingHand, getChanceToOpenCards } from "../util/deckAnalytics";

const StartingHand = (props) => {
  const { deck } = props;

  const [sampleStartingHand, setSampleStartingHand] = React.useState([]);
  const [chanceToOpenCards, setChanceToOpenCards] = React.useState([]);

  return (
    <CollapsibleDropdown title="Starting Hand">
      <Button
        text="Get a Sample Starting Hand"
        onClick={() => setSampleStartingHand(getStartingHand(deck))}
      />
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
        onClick={() => setChanceToOpenCards(getChanceToOpenCards(deck))}
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
