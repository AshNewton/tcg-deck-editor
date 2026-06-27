import React from "react";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18n";

import { Provider } from "react-redux";
import { SnackbarProvider } from "./context/SnackbarContext";

import { store } from "./store";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);
