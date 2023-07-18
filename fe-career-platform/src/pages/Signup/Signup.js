import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Signup.scss';
import { Link } from '@mui/material';
import axios from 'axios';

export default function Signup() {
  const [userType, setUserType] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleEmailChange = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(event.target.value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!emailError) {
      // TODO: Call API to register user
      console.log('signup submitted:', userType, email, password);
      // const token = loginUser(userType, email, password);
      // console.log('token' ,token)
      const baseURL = "https://7140-66-22-167-208.ngrok-free.app"
      axios.post(`${baseURL}/signup`, {
        // userType,
        role: userType,
        email,
        password
      }).then((res) => {
        console.log('res: ', res);
      }).then((err) => {
        console.log('err: ', err);
      })
    }
  };

  

  return (
    <div className='signup-container'>
      <h2>Sign up</h2>
      <form>
        <div className='user-type-container'>
          <label>User Type:</label>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="candidate"
            name="radio-buttons-group"
            onChange={handleUserTypeChange}
          >
            <FormControlLabel value="Candidate" control={<Radio />} label="Candidate" />
            <FormControlLabel value="Employer" control={<Radio />} label="Employer" />
          </RadioGroup>
        </div>
        <TextField id="email" className='textfield' label="Email" variant="outlined" onChange={handleEmailChange} error={emailError}/ >
        <TextField id="password" type="password" autoComplete="current-password" className='textfield' label="Password" variant="outlined" onChange={handlePasswordChange} />
        
        <Button className="button" variant="contained" onClick={handleSubmit}>Register</Button>
      </form>
      <Link className="link"
        underline="hover"
        color="inherit"
        href="/login">
        Already having a account? Login</Link>
    </div>
  );
};
