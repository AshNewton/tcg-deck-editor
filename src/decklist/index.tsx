import Body from "./body/Body";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { useMediaQuery, useTheme } from "@mui/material";

const Decklist = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (isSmallScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Sidebar />
          <Box pr={4}>
            <Body />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header />

      <Grid
        container
        sx={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Grid
          item
          md={3}
          sx={{
            overflowY: "auto",
            maxHeight: "100%",
            minHeight: 0,
          }}
        >
          <Sidebar />
        </Grid>
        <Grid
          item
          md={9}
          sx={{
            overflowY: "auto",
            maxHeight: "100%",
            minHeight: 0,
            pr: 4,
          }}
        >
          <Body />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Decklist;
