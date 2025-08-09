import { createSlice } from '@reduxjs/toolkit';
import { loadState } from './storeAutosave';
import { setHostId } from './hostSlice';

const initialState = {
  myId: null,
  hostId: null,
  myName: null,
  myScore: 0,
  myAvatar: null //just the URL
};

const playerSlice = createSlice({
  name: 'player',
  initialState: {...initialState, ...loadState("player")},
  reducers: {
    setHost(state, action) {
      state.hostId = action.payload;
    },
    setMyId(state, action) {
      state.myId = action.payload;
    },
    setMyName(state, action) {
      state.myName = action.payload;
    },
    setMyScore(state, action) {
      state.myScore = action.payload;
    },
    setMyAvatar(state, action) {
      state.myAvatar = action.payload;
    },
  },
});

export default playerSlice.reducer;
export const {
  setHost
  , setMyId
  , setMyName
  , setMyScore
  , setMyAvatar
} = playerSlice.actions;

export const selectPlayerData = (state: any) => state.player;