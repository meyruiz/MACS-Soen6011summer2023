import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <h2>Career Platform Header</h2>
      <Router>
          <Routes>
              <Route exact path="/" element={<p>This is login page!</p>} />
            <Route path="/registration" element={<p>This is registration page!</p>} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;