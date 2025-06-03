import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#181818", // Slightly lighter than pure black
      paper: "#232323", // Used for cards/dialogs/app bars
    },
    primary: {
      main: "#20aab9", // darkish blue
    },
    secondary: {
      main: "#f48fb1", // Pink accent
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#b0b0b0",
    },
    divider: "#2c2c2c",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#181818",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "background 0.3s ease",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "8px 12px",
        },
      },
    },
  },
});

export default darkTheme;
