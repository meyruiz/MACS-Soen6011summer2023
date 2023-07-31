import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home';
import Profile from './pages/Profile/Profile';
import CandidateApplications from './pages/CandidateApplications/CandidateApplications';
import JobPosting from './pages/JobPosting/JobPosting';
import AdminCandidates from './pages/AdminCandidates/AdminCandidates';
import AdminEmployers from './pages/AdminEmployers/AdminEmployers';

function App() {
  return (
    <div>
      <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/candidate/applications" element={<CandidateApplications />} />
            <Route path="/employer/jobposting" element={<JobPosting />} />
            <Route path="/admin/candidates" element={<AdminCandidates />} />
            <Route path="/admin/employers" element={<AdminEmployers />} />
            {/* <Route path="/employer/createJobPosting" element={<CreateJobPosting />} /> */}
          </Routes>
        </Router>
    </div>
  );
}

export default App;