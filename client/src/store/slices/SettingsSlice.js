import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLanguage: {
    name: "English",
    code: "EN",
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
  },
});

export const { changeLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
