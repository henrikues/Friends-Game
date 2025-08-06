import { configureStore } from '@reduxjs/toolkit';
import hostReducer from './hostSlice';
import playerReducer from './playerSlice';

const store = configureStore({
  reducer: {
    host: hostReducer,
    player: playerReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
