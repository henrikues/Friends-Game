import { createSlice } from '@reduxjs/toolkit';
import { loadState } from './storeAutosave';

const initialState = {
  // Add host-specific state here
  hostInfo: {
    serverType: 'Public Server',
    hostId: null,
    privateServer: {
      name: '',
      port:'',
      path: ''
    },
    joinUrl: null
  },
  players: {}
};


const hostSlice = createSlice({
  name: 'host',
  initialState: {
    ...initialState,
    ...loadState("host")
  },
  reducers: {
    setServerType (state, action) {
      state.hostInfo.serverType = action.payload;
    },
    setPrivateServer (state, action) {
      const { name, port, path } = action.payload;
      if (name)
        state.hostInfo.privateServer.name = name;
      if (port)
        state.hostInfo.privateServer.port = port;
      if (path)
        state.hostInfo.privateServer.path = path;
    },
    resetHost () {
      return initialState;
    },
    addPlayer (state, action) {
      const player  = action.payload;
      if (!(player.peer in state.players)) {
        state.players[player.peer] = {};
      }
      state.players[player.peer].conn = player;
      state.players[player.peer].name = player.label;
    },
    setHostId (state, action) {
      state.hostInfo.hostId = action.payload;
    },
    setJoinUrl (state, action) {
      state.hostInfo.joinUrl = action.payload;
    }
  },
});

export const selectHostData = (state: any) => state.host;
export const selectPrivateServerData = (state: any) => state.host.hostInfo.privateServer;

export default hostSlice.reducer;
export const { 
  setServerType
  , setPrivateServer
  , setHostId
  , resetHost
  , addPlayer
  , setJoinUrl
} = hostSlice.actions;
