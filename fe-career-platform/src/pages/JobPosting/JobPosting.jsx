import React, { Component, useEffect, useState } from 'react'
import Navbar from '../Home/Navbar/navbar';
import ApiFun from '../../Service/api';
import {  Button, Card, CardContent, TextField, Typography } from '@mui/material';
import "./JobPosting.css"
import JobPostingInterviewList from './JobPostingInterviewList/JobPostingInterviewList';

export default function JobPosting() {
    const [companyName, setCompanyName] = React.useState('');
    const [jobTitle, setJobTitle] = React.useState('');
    const [jobDescription, setJobDescription] = React.useState('');
    const [jobSkillSet, setjobSkillSet] = React.useState([]);

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
        const from = {companyName, jobTitle, jobDescription, skillSets: jobSkillSet}
        console.log(from);

        // clear the default messages
        setopenJobPostingSection(false);
        setCompanyName('');
        setJobTitle('');
        setJobDescription('');

        const employer_id = localStorage.getItem('userid');
        const URL = `/employer/post/${employer_id}`;
        console.log(URL);
        console.log(from)
        ApiFun.postApi(URL, from)
            .then((res=> {
                window.location.reload();
                console.log(res);
            }))
            .catch((err) => {
                console.error(err)
                console.log(12312312);
            });
    }

    // todo: edit the job 
    const handleUpdate = (jobId) => {}

    // todo : remove job posting by id
    const handleRemove = (jobId) => {}

    const handleJobSkillSet = (e) => {
        const content = e.target.value;
        const res = content.split(" ");
        // console.log(res);
        setjobSkillSet([...res])
        // console.log("job", jobSkillSet);
    }

    const [jobPostingData, setJobPostingData] = useState([])
    const [isEmployer, setIsEmployer] = useState(false)
    useEffect(() => {
        const role = localStorage.getItem('userRole');
        // console.log(role)

        // double check if user is an employer
        if(role === 'Employer') {
            setIsEmployer(true);
        }

        const employer_id = localStorage.getItem('userid');
        ApiFun.getApi(`/employer/${employer_id}/jobs`).then((res) => {
            console.log(res.data);
            setJobPostingData([...jobPostingData, ...res.data]);
            // console.log(jobPostingData)
        });
    },[])

    return (
        <>
            <Navbar/>

            {!isEmployer && (
                <div>Empolyer Only Page</div>
            )}

            {/* Job posting form */}
            {isEmployer && (
            <div className='header'>
                <h1>List of Job Posting</h1>
                {!openJobPostingSection && (
                    <Button className="button-right" variant="contained" onClick={handleJobPostingSection}>
                        Create a Job Posting
                    </Button>
                )}
            </div>)}
            
                
        
            {(isEmployer && openJobPostingSection) && (
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
                            label="Job Skillsets"
                            multiline
                            rows={4}
                            onChange={handleJobSkillSet}/>

                        
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
                isEmployer && jobPostingData && jobPostingData.map((job) => {
                    return (
                        <Card 
                            className='card'
                            sx={{
                                boxShadow: 1,
                                borderRadius: 2,
                                
                                marginTop: 5,
                                marginLeft: 5,
                                
                                width: 1700,
                                height: 200
                            }}
                            key={job._id}
                            >
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Company Name: {job.companyName}
                                    </Typography>
                                    <Typography gutterBottom variant="h7" component="div">
                                        Job Title: {job.jobTitle}
                                    </Typography>
                                    <Typography gutterBottom variant="h7" component="div">
                                        Skill: 
                                        <div className='skillsets'>
                                            {
                                                job.skillSets.map((skill) =>{
                                                    return (
                                                        
                                                        <div>{skill}</div>
                                        
                                                    )
                                                })
                                            }
                                        </div>
                                     </Typography>
                                    

                                    <Typography variant="body2" color="text.secondary">
                                        Job description: {job.jobDescription}
                                    </Typography>
                                    <JobPostingInterviewList jobid={job._id}/>
                                    {/* <Typography gutterBottom variant="h5" component="div">
                                        Salary: {job.salary}
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Location: {job.location}
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Relatice Skills: {job.skillSets}
                                    </Typography> */}
                                </CardContent>
                                {/* <Button onClick={handleRemove(job._id)}> Remove </Button> */}
                                {/* <Button onClick={handleUpdate(job._id)}> Edit </Button> */}
                        </Card>
                    )
                })
            }
        </>
    )
}
