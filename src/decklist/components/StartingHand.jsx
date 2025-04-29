import * as React from "react";

import Button from "./Button";
import CollapsibleDropdown from "./CollapsibleDropdown";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { getStartingHand } from "../util/deckAnalytics";

const StartingHand = (props) => {
  const { deck } = props;

  const [sampleStartingHand, setSampleStartingHand] = React.useState([]);

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
    </CollapsibleDropdown>
  );
};

export default StartingHand;
