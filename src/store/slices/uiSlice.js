import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    maindeck: [],
    extradeck: [],
    selectedCard: null,
  },
  reducers: {
    setMainDeck: (state, action) => {
      state.maindeck = action.payload;
    },
    setExtraDeck: (state, action) => {
      state.extradeck = action.payload;
    },
    setSelectedCard: (state, action) => {
      state.selectedCard = action.payload;
    },
  },
});

export const { setMainDeck, setExtraDeck, setSelectedCard } = uiSlice.actions;
export default uiSlice.reducer;
