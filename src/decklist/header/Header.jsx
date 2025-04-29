import * as React from "react";

import Text from "../components/Text";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const Header = (props) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Text text="Decklist Editor" fontSize={48} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
