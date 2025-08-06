import { createSlice } from '@reduxjs/toolkit';
import { loadState } from './storeAutosave';

const initialState = {
  ...loadState().player
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Add player-specific reducers here
  },
});

export default playerSlice.reducer;
export const {} = playerSlice.actions;
