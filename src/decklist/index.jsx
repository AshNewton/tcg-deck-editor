import Body from "./body/Body.jsx";
import Header from "./header/Header.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";

import Grid from "@mui/material/Grid";

const Decklist = (props) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item md={4} xs={12}>
        <Sidebar />
      </Grid>
      <Grid item md={8} xs={12}>
        <Body />
      </Grid>
    </Grid>
  );
};

export default Decklist;
