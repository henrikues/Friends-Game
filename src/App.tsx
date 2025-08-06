import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './slices/store';
import {Host} from './components/Host';
import {Player} from './components/Player';
import {Home} from './components/Home';
import { saveState } from './slices/storeAutosave';

//Autosaves State
store.subscribe(() => {
  saveState(store.getState());
});


function App() {
  return (
    <Provider store={store}>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
