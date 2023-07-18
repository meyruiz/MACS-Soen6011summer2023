import React, { useState } from "react"
import './Login.scss'
import { Button, FormControlLabel, Link, Radio, RadioGroup, TextField, dividerClasses } from "@mui/material";
import axios from "axios";
import UserProfile from "../../Model/UserProfile";

export default function Login()  {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    

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

    const handleLogin = (event) => {
        event.preventDefault();
        const baseURL = "https://7140-66-22-167-208.ngrok-free.app"
        if (!emailError) {
          axios.post(`${baseURL}/login`, {
            email,
            password
          }).then((res) => {
            if(res.status === 200) {
              UserProfile.setName("Some Name");
              window.location.href = "/";
            } 
          })
        }
      };

    return (
        <div className="container">
            <h2>Login</h2>
            <form>
                <TextField id="email" className='textfield' label="Email" variant="outlined" onChange={handleEmailChange} error={emailError}/ >
                <TextField id="password" type="password" autoComplete="current-password" className='textfield' label="Password" variant="outlined" onChange={handlePasswordChange} />
                
                <Button className="button" variant="contained" onClick={handleLogin}>Login</Button>
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