import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './app';

export * from './app';

export const rootReducer = combineReducers({
  app: appReducer,
});
