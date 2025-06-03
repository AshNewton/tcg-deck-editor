import { ThemeProvider, CssBaseline } from "@mui/material";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Decklist from "./decklist";
import darkTheme from "./theme";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Decklist />
      </div>
    </ThemeProvider>
  );
}

export default App;
