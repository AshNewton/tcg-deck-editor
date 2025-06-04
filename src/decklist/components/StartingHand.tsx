import React from "react";

import CollapsibleDropdown from "./mui/CollapsibleDropdown";
import Text from "./mui/Text";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MuiCard from "@mui/material/Card";
import ReplayIcon from "@mui/icons-material/Replay";

import { getCardHandSize } from "../util/util";
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

  const game = useAppSelector((state) => state.ui.game);

  React.useEffect(() => {
    setSampleStartingHand([]);
    setChanceToOpenCards([]);
  }, [game]);

  const handSize = getCardHandSize(game);

  const generateOpeningHand = () => {
    setSampleStartingHand(getStartingHand(maindeck, handSize).sort());
  };

  const generateOpeningHandProbabilities = () => {
    setChanceToOpenCards(
      getChanceToOpenCards(maindeck, handSize).sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );
  };

  return (
    <MuiCard
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        mt: 2,
        ml: 2,
        mr: 2,
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
          <List>
            {sampleStartingHand.map((cardname, index) => (
              <ListItem key={index}>
                <ListItemText primary={cardname} />
              </ListItem>
            ))}
          </List>
        )}
        <IconButton onClick={generateOpeningHand}>
          <ReplayIcon />
        </IconButton>
      </CollapsibleDropdown>

      <CollapsibleDropdown
        title="Calculate Probability to Open Cards"
        onOpen={generateOpeningHandProbabilities}
        onCollapse={() => {
          setChanceToOpenCards([]);
        }}
      >
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
    </MuiCard>
  );
};

export default StartingHand;
