import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './slices/store';
import { Host } from './components/Host/Host';
import { Player } from './components/Player/Player';
import { Home } from './components/Home';
import { saveState } from './slices/storeAutosave';
import { Container, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Game from './components/Host/Game';
import { useRef } from 'react';
import PlayerControls from './components/Player/PlayerControls';


//Autosaves State
store.subscribe(() => {
  saveState(store.getState());
});

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  let peerRef = useRef(null);
  let connectionsRef = useRef({});
  let canvasRef = useRef(null);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Provider store={store}>
        <Container fluid style={{ textAlign: 'center', padding: '20px' }}>
          <Router basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/host" element={<Host peerRef={peerRef} connectionsRef={connectionsRef}/> } />
              <Route path="/player" element={<Player peerRef={peerRef} connectionsRef={connectionsRef}/>} />
              <Route path="/game" element={<Game peerRef={peerRef} connectionsRef={connectionsRef} canvasRef={canvasRef} />} />
              <Route path="/playerGame" element={<PlayerControls peerRef={peerRef} connectionsRef={connectionsRef}/>} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Router>
        </Container>
      </Provider>
    </MantineProvider>
  );
}

export default App;
