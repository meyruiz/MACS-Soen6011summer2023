import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Signup.scss';
import { Link } from '@mui/material';
import ApiFun from '../../Service/api';

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

      const user = {userType, email, password}
      ApiFun.postApi("/signup", user)
          .then((e) => {
              if(e.status === 200){
                console.log(e.data);
                // localStorage.setItem('userid', e.data.id);
                // localStorage.setItem('userEmail', e.data.email);
                // localStorage.setItem('userRole', e.data.role);
                // console.log(localStorage.getItem('userid'));
                // console.log(localStorage.getItem('userEmail'));
                // console.log(localStorage.getItem('userRole'));
                window.location.href = "/login";
              }
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
