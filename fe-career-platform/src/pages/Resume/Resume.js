import React, { useState } from 'react';
import './Resume.scss';
import Navbar from '../Home/Navbar/navbar';
import { Button, TextField } from "@mui/material";

export default function Resume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [education, setPreviousExperience] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const updateResume = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileBytes = new Uint8Array(event.target.result);
        // TODO: Send the fileBytes to the backend
        console.log(fileBytes);
      };

      reader.readAsArrayBuffer(selectedFile);
    }

    //TODO: Send resume to backend
  };

  return (
    <div>
        <Navbar/>
        <div className="resume-container">
            <h2>Resume</h2>

            <TextField
                className='textfield'
                label="Previous experience"
                multiline
                rows={4}
                onChange={(e)=> setPreviousExperience(e.target.value)}/>

            <TextField
                className='textfield'
                label="Education"
                multiline
                rows={4}
                onChange={(e)=> setEducation(e.target.value)}/>

            <h5>Upload your resume</h5>
            <input type="file" onChange={handleFileChange} />
            <Button className="button" variant="contained" onClick={updateResume}>Update resume</Button>
        </div>
    </div>
  );
};
