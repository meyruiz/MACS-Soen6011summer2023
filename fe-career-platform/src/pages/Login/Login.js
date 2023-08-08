import React, { useState } from "react"
import './Login.scss'
import { Button, FormControlLabel, Link, Radio, RadioGroup, TextField, dividerClasses } from "@mui/material";
import axios from "axios";
import UserProfile from "../../Model/UserProfile";
import ApiFun from "../../Service/api";

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
        const user = {email, password};
        ApiFun.postApi("/login", user)
          .then((e) => {
              if(e.status === 200 && e.data?.status === 200){
                console.log(e.data);
                localStorage.setItem('userid', e.data.id);
                localStorage.setItem('userEmail', e.data.email);
                localStorage.setItem('userRole', e.data.role);
                window.location.href = "/";
              } else if (e.data?.status !== 200) {
                  alert("Invalid email or password");
              } else {
                  alert("Something went wrong. Please try again later.");
              }
            })
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