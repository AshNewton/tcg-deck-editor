import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

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
            <Typography fontSize={48}>Decklist Editor</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
