import React, { Component, useEffect, useState } from 'react'
import Navbar from '../Home/Navbar/navbar';
import ApiFun from '../../Service/api';
import { Alert, AlertTitle, Button, TextField } from '@mui/material';
import "./JobPosting.css"

export default function JobPosting() {
    const [companyName, setCompanyName] = React.useState('');
    const [jobTitle, setJobTitle] = React.useState('');
    const [jobDescription, setJobDescription] = React.useState('');

    // const [successAlertBox, setSuccessAlertBox] = React.useState(false);
    // const [failAlertBox, setFailAlertBox] = React.useState(false);
    // const handleCloseAlertBox = () => {
    //     setFailAlertBox(false);
    //     setSuccessAlertBox(false);
    // }

    const [openJobPostingSection, setopenJobPostingSection] = React.useState(false);
    const handleJobPostingSection = () => {
        setopenJobPostingSection(true);
    }

    const handleCloseSection = () => {
        setopenJobPostingSection(false);
    }

    const handleJobPostingSubmit = () => {
        if(companyName === ''  || jobDescription === '' || jobTitle === '') {
            return;
        }
        const from = {companyName, jobTitle, jobDescription}
        console.log(from);

        // clear the default messages
        setopenJobPostingSection(false);
        setCompanyName('');
        setJobTitle('');
        setJobDescription('');

        const employer_id = localStorage.getItem('userid');
        const URL = `/employer/post/${employer_id}`;
        console.log(URL);
        ApiFun.postApi(URL, from)
            .then((res=> {
                console.log(res);
                
            }))
            .catch((err) => {
                console.error(err)
            });
    }

    const [jobPostingData, setJobPostingData] = useState([])
    useEffect(() => {
        const employer_id = localStorage.getItem('userid');
        ApiFun.getApi(`/employer/${employer_id}/jobs`).then((res) => {
            console.log(res.data);
            jobPostingData.push(...res.data);
            console.log(jobPostingData)
            // remove dupliate
            // jobDescription.map
        });
    },[])

    return (
        <>
            <Navbar/>

            {/* Job posting form */}
            <div className='header'>
                <h1>List of Job Posting</h1>
                {!openJobPostingSection && (
                    <Button variant="contained" onClick={handleJobPostingSection}>
                        Create a Job Posting
                    </Button>
                )}
            </div>
                
        
            {openJobPostingSection && (
                <form>
                    <div className='textfields'>

                        <TextField
                            required
                            label="Company Name"
                            onChange={(e)=> setCompanyName(e.target.value)}/>

                        <TextField
                            required
                            label="Job Title"
                            onChange={(e)=> setJobTitle(e.target.value)}/>

                        <TextField
                            required
                            label="Job Description"
                            multiline
                            rows={4}
                            onChange={(e)=> setJobDescription(e.target.value)}/>
                    </div>
                    
                    <div className='buttons'>
                        <Button variant="contained" onClick={handleJobPostingSubmit}>
                            Submit
                        </Button>
                        <Button variant="contained" onClick={handleCloseSection}>
                            Close
                        </Button>
                    </div>
                    
                </form>)
            }

            {/* render list of job in here */}
            {
                jobPostingData && jobPostingData.map((data) => {
                    return (
                        <div>
                            {data._id}
                        </div> 
                    )
                })
            }
        </>
    )
}
