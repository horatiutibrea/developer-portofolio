import { setupListeners } from '@reduxjs/toolkit/query';
import { throttle } from 'underscore';
import { useSelector } from 'react-redux';
import { loadLocalStorageState, saveStateToLocalStorage } from '@utils';
import { configureStore } from '@reduxjs/toolkit';
import {
  rootReducer,
} from './reducers';

export const store = configureStore({
  preloadedState: loadLocalStorageState(),
  reducer: rootReducer,
});

setupListeners(store.dispatch);

store.subscribe(
  throttle(() => {
    saveStateToLocalStorage(store.getState());
  }, 200),
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useRootSelector = useSelector.withTypes<RootState>();
