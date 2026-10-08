import { createSlice } from '@reduxjs/toolkit';

type SliceState = {
  themeMode: 'light' | 'dark';
};

const initialState: SliceState = {
  themeMode: 'dark',
};

const themeSlice = createSlice({
  name: 'app.theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
