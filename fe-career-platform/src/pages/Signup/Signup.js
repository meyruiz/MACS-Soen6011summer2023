import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Signup.scss';

const Signup = () => {
  const [userType, setUserType] = useState('candidate');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
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
      console.log('signup submitted:', userType, username, email, password);
    }
  };

  return (
    <div class='signup-container'>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div class='user-type-container'>
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
        <TextField id="username" className='textfield' label="Username" variant="outlined" onChange={handleUsernameChange}/>
        <TextField id="email" className='textfield' label="Email" variant="outlined" onChange={handleEmailChange} error={emailError}/ >
        <TextField id="password" type="password" autoComplete="current-password" className='textfield' label="Password" variant="outlined" onChange={handlePasswordChange} />

        {/* Add first name, last name and confirm password ?*/}
        
        <Button className="button" variant="contained">Register</Button>
      </form>
    </div>
  );
};

export default Signup;