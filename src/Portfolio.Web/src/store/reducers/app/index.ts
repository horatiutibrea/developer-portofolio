import { combineReducers } from '@reduxjs/toolkit';
import { themeReducer } from './theme.reducer';
import { appbarReducer } from './appbar.reducer';
import { authReducer } from './auth.reducer';

export * from './theme.reducer';
export * from './appbar.reducer';
export * from './auth.reducer';
export * from './models';

export const appReducer = combineReducers({
  theme: themeReducer,
  appbar: appbarReducer,
  auth: authReducer,
});
