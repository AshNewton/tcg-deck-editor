import React from "react";

import Body from "./body/Body";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

import Grid from "@mui/material/Grid";

const Decklist = () => {
  return (
    <Grid container direction="column" sx={{ height: "98vh" }}>
      {/* Header */}
      <Grid item>
        <Header />
      </Grid>

      {/* Main content: Sidebar + Body */}
      <Grid item xs sx={{ overflow: "hidden", minHeight: 0 }}>
        <Grid container sx={{ height: "100%" }}>
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              height: "100%",
              overflowY: "auto",
              borderRight: "1px solid #ddd",
            }}
          >
            <Sidebar />
          </Grid>
          <Grid
            item
            md={8}
            xs={12}
            sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
          >
            <Body />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Decklist;
