import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';

function App() {
  return (
    <div>
      <Router>
          <Routes>
            <Route exact path="/" element={<p>This is login page!</p>} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;