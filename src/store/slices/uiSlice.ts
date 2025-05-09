import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Card, Game } from "../../types";

interface UIState {
  game: Game;
  maindeck: Array<Card>;
  extradeck: Array<Card>;
  selectedCard: Card | null;
}

const initialState: UIState = {
  game: "Yugioh",
  maindeck: [],
  extradeck: [],
  selectedCard: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
      state.game = action.payload;

      //changing game clears the deck
      state.maindeck = [];
      state.extradeck = [];
      state.selectedCard = null;
    },
    setMainDeck: (state, action: PayloadAction<Array<Card>>) => {
      state.maindeck = action.payload;
    },
    setExtraDeck: (state, action: PayloadAction<Array<Card>>) => {
      state.extradeck = action.payload;
    },
    setSelectedCard: (state, action: PayloadAction<Card | null>) => {
      state.selectedCard = action.payload;
    },
  },
});

export const { setGame, setMainDeck, setExtraDeck, setSelectedCard } =
  uiSlice.actions;
export default uiSlice.reducer;
