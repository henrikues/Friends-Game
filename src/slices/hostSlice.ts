import { createSlice } from '@reduxjs/toolkit';
import { loadState } from './storeAutosave';

const initialState = {
  // Add host-specific state here
  host: {
    id: 'test5',
  }
  , ...loadState().host
};

const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    // Add host-specific reducers here
  },
});

export default hostSlice.reducer;
export const {} = hostSlice.actions;
