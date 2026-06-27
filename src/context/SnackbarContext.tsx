import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

type SnackbarContextType = {
  showMessage: (message: string, severity?: AlertColor) => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
};

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message: string, severity: AlertColor = "success") => {
    setState({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = () => {
    setState((s) => ({ ...s, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      <Snackbar
        open={state.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={state.severity} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};