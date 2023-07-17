import React, { useState } from "react"
import './Login.scss'
import { Button, FormControlLabel, Link, Radio, RadioGroup, TextField, dividerClasses } from "@mui/material";

const Login = () => {
    const [userType, setUserType] = useState('canadiate');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    
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
        }
      };

    return (
        <div class="container">
            <h2>Login</h2>
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
                    <FormControlLabel value="Admin" control={<Radio />} label="Admin" />

                </RadioGroup>
                </div>
                <TextField id="email" className='textfield' label="Email" variant="outlined" onChange={handleEmailChange} error={emailError}/ >
                <TextField id="password" type="password" autoComplete="current-password" className='textfield' label="Password" variant="outlined" onChange={handlePasswordChange} />
                
                <Button className="button" variant="contained">Login</Button>
            </form>
            <Link className="link"
              underline="hover"
              color="inherit"
              href="/signup">
              Don't have a account yet? Signup
            </Link>
        </div>
    );
};

export default Login;