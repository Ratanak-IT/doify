import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "./types";

interface I18nState {
  language: Language;
}

const initialState: I18nState = {
  language: "en",
};

const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    loadLanguageFromStorage: (state) => {
      const saved = localStorage.getItem("language") as Language | null;
      if (saved && (saved === "en" || saved === "kh")) {
        state.language = saved;
      }
    },
  },
});

export const { setLanguage, loadLanguageFromStorage } = i18nSlice.actions;
export default i18nSlice.reducer;
