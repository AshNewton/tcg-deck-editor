import React from "react";

import Body from "./body/Body";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

import Grid from "@mui/material/Grid";

const Decklist = () => {
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
