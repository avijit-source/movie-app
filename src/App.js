import './App.css';
import Movies from './components/Movies';
import Favourites from './components/Favourites';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Layout } from './components/Layout';
function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Movies  />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
