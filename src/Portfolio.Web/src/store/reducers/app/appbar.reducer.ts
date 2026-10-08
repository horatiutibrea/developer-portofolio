import { createSlice } from '@reduxjs/toolkit';
import { TranslationKey } from 'src/types/i18next';

type SliceState = {
  title: TranslationKey,
  back: string | (() => void) | null,
  isDrawerOpen: boolean,
};

const initialState: SliceState = {
  title: 'general.appName',
  back: null,
  isDrawerOpen: false,
};

const appbarSlice = createSlice({
  name: 'app.appbar',
  initialState,
  reducers: {
    setAppbarTitle: (state, action) => {
      state.title = action.payload;
    },
    setAppbarBack: (state, action) => {
      state.back = action.payload;
    },
    setIsDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const { setAppbarBack, setAppbarTitle, setIsDrawerOpen } = appbarSlice.actions;
export const appbarReducer = appbarSlice.reducer;
