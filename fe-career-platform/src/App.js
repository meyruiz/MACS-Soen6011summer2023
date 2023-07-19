import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home';
import JobPosting from './pages/JobPosting/JobPosting';

function App() {
  return (
    <div>
      <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employer/jobposting" element={<JobPosting />} />
            {/* <Route path="/employer/createJobPosting" element={<CreateJobPosting />} /> */}
          </Routes>
        </Router>
    </div>
  );
}

export default App;