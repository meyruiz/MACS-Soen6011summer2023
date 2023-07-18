import React, { useState } from 'react';
import './Profile.scss';
import { Button, TextField } from "@mui/material";
import Navbar from '../Home/Navbar/navbar';

export default function Profile()  {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleUpdateProfile = (event) => {
        event.preventDefault();
        // call api to update profile
    };

    // TODO: Call api first and get profile

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <h2>Profile update</h2>
                <form>
                    <TextField id="firstName" className='textfield' label="First Name" variant="outlined" onChange={handleFirstNameChange} />
                    <TextField id="lastName" className='textfield' label="Last Name" variant="outlined" onChange={handleLastNameChange} />

                    <Button className="button" variant="contained" onClick={handleUpdateProfile}>Update profile</Button>
                </form>
            </div>
        </div>
    );
};