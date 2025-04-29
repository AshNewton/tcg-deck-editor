import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Card } from "../../types";

interface UIState {
  maindeck: Array<Card>;
  extradeck: Array<Card>;
  selectedCard: Card | null;
}

const initialState: UIState = {
  maindeck: [],
  extradeck: [],
  selectedCard: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
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

export const { setMainDeck, setExtraDeck, setSelectedCard } = uiSlice.actions;
export default uiSlice.reducer;
