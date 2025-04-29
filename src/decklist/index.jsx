import * as React from "react";

import Body from "./body/Body.jsx";
import Header from "./header/Header.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";

import Grid from "@mui/material/Grid";

const Decklist = (props) => {
  const [maindeck, setMaindeck] = React.useState([]);

  const [extradeck, setExtradeck] = React.useState([]);

  const [selectedCard, setSelectedCard] = React.useState(null);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item md={4} xs={12}>
        <Sidebar
          maindeck={maindeck}
          setMaindeck={setMaindeck}
          extradeck={extradeck}
          setExtradeck={setExtradeck}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <Body
          maindeck={maindeck}
          selectedCard={selectedCard}
          onCardDeselect={() => setSelectedCard(null)}
        />
      </Grid>
    </Grid>
  );
};

export default Decklist;
