import React, { useState, useEffect } from 'react';
import './Profile.scss';
import Navbar from '../Home/Navbar/navbar';
import { Button, TextField } from "@mui/material";
import ApiFun from '../../Service/api';

export default function Profile() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [previous_experience, setPreviousExperience] = useState('');
    const [skills, setSkills] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [pdf, setPdf] = useState('test');
    const [resume_id, setResumeId] = useState('');


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if(selectedFile.size > 1048576){
            alert("File is too big! Try adding a new file less than 1MB");
            setSelectedFile('');
         } else {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const base64String = event.target.result;
                setPdf(base64String);
                setSelectedFile(base64String);
                console.log(base64String);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpdateResume = (event) => {
        const role = localStorage.getItem('userRole');
        let candidate_id = localStorage.getItem('userid');

        if(role && role.toLowerCase()  === 'admin') {
            candidate_id = localStorage.getItem('adminCandidateId');
        } else {
            candidate_id = localStorage.getItem('userid');
        }

        const resumeForm = { pdf }

        ApiFun.postApi(`/candidate/${candidate_id}/resume`, resumeForm)
            .then((res=> {
                window.location.reload();
                console.log(res);
            }))
            .catch((err) => {
                console.error(err)
            });
    }

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSkillsChange = (event) => {
        setSkills(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleUpdateProfile = (event) => {
        event.preventDefault();
        // call api to update profile

        const role = localStorage.getItem('userRole');
        let candidate_id = localStorage.getItem('userid');

        if(role && role.toLowerCase()  === 'admin') {
            candidate_id = localStorage.getItem('adminCandidateId');
        } else {
            candidate_id = localStorage.getItem('userid');
        }

        const form = { first_name, last_name, location, description, email, phone_number, previous_experience, skills }

        console.log(form);
        ///candidate/profile/<candidate_id>
        ApiFun.postApi(`/candidate/profile/${candidate_id}`, form)
            .then((res=> {
                window.location.reload();
                console.log(res);
            }))
            .catch((err) => {
                console.error(err)
            });
    };

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        let candidate_id = localStorage.getItem('userid');

        if(role && role.toLowerCase()  === 'admin') {
            candidate_id = localStorage.getItem('adminCandidateId');
        } else {
            candidate_id = localStorage.getItem('userid');
        }

        ApiFun.getApi(`/candidate/profile/${candidate_id}`).then((res) => {
            setFirstName(res.data.first_name);
            setLastName(res.data.last_name);
            setLocation(res.data.location);
            setDescription(res.data.description);
            setEmail(res.data.email);
            setPhoneNumber(res.data.phone_number);
            setPreviousExperience(res.data.previous_experience);
            setSkills(res.data.skills);
            setResumeId(res.data.resume_id);

            if (res.data.resume_id !== null) {
                ApiFun.getApi(`/candidate/resume/${res.data.resume_id}`).then((res) => {
                    console.log(res.data);
                    setPdf(res.data.file.pdf);
                });
            }
        });
    
    },[resume_id])

  return (
    <div>
        <Navbar/>
        <div className="resume-container">
            <h2>Profile</h2>

            <TextField id="firstName" className='textfield' label="First Name" variant="outlined"value={first_name} onChange={handleFirstNameChange} />
            <TextField id="lastName" className='textfield' label="Last Name" variant="outlined" value={last_name} onChange={handleLastNameChange} />
            <TextField id="location" className='textfield' label="Location" variant="outlined" value={location} onChange={handleLocationChange} />
            <TextField id="skills" className='textfield' label="Skills" variant="outlined" value={skills} onChange={handleSkillsChange} />
            <TextField id="email" className='textfield' label="Email" variant="outlined" value={email} onChange={handleEmailChange} />
            <TextField id="phoneNumber" className='textfield' label="Phone Number" variant="outlined" value={phone_number} onChange={handlePhoneNumberChange} />


            <TextField
                className='textfield'
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e)=> setDescription(e.target.value)}/>

            <TextField
                className='textfield'
                label="Previous experience"
                multiline
                rows={4}
                value={previous_experience || ''}
                onChange={(e)=> setPreviousExperience(e.target.value)}/>

            <Button className="button" variant="contained" onClick={handleUpdateProfile}>Update profile</Button>


            <h5>Upload your resume</h5>
            <input type="file" onChange={handleFileChange} />

            <div>
                <iframe src={pdf} width="100%" height="600px" title="PDF Viewer" /> 
           
           </div> 
           <Button className="button" variant="contained" onClick={handleUpdateResume}>Update resume</Button>
        </div>
    </div>
  );
};
