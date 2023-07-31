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


    const adminHandleRemoveJob= (jobID) => {
        setJobPostingData(jobPostingData.filter(job => job._id !== jobID));
        const employer_id = localStorage.getItem("userid");
        ApiFun.deleteApi(`/employer/${employer_id}/${jobID}`).then((e) => {
            console.log(e)}
        ).then((err) => {
            console.log(err);
        });
    }

    const [openEditSection, closeEditSection] = useState(false)
    const [empolyerid, setEmpolyerid] = React.useState('')
    const [jobID, setJobID] = React.useState('')
    const handleEditSection = (jobID, empolyerid, companyName, jobTitle, skillSets, jobDescription) => {
        closeEditSection(!openEditSection)
        console.log("openEditSection", openEditSection)
        console.log(jobID)
        console.log(empolyerid)
        console.log(companyName)
        console.log(jobTitle)
        console.log(skillSets)
        console.log(jobDescription)

        setCompanyName(companyName)
        setJobTitle(jobTitle)
        setJobDescription(jobDescription)
        if(skillSets){
            setjobSkillSet([...skillSets])
        }
        setEmpolyerid(empolyerid)
        setJobID(jobID)
       
        console.log(jobTitle)
        console.log()
        console.log(jobDescription)
    }


    const handleJobPostingEditSubmit = () => {
        if(companyName === ''  || jobDescription === '' || jobTitle === '') {
            return;
        }
        const from = {companyName, jobTitle, jobDescription, skillSets: jobSkillSet}
        console.log(from);

        // clear the default messages
        closeEditSection(false);
        setCompanyName('');
        setJobTitle('');
        setJobDescription('');
        setjobSkillSet([])
        setEmpolyerid('')
        setJobID('')

        const employer_id = empolyerid;
        const job_id = jobID
        const URL = `/employer/${employer_id}/${job_id}`;
        console.log(URL);
        console.log(from)
        ApiFun.putApi(URL, from)
            .then((res=> {
                window.location.reload();
                console.log(res);
            }))
            .catch((err) => {
                console.error(err)
                console.log(12312312);
            });
    }

    return (
        <>
            <Navbar/>

            {
                openEditSection ? (
                    <form>
                        <div className='textfields'>
                            <TextField
                                required
                                label="Company Name"
                                defaultValue={companyName}
                                onChange={(e)=> setCompanyName(e.target.value)}/>

                             <TextField
                                required
                                label="Job Title"
                                defaultValue={jobTitle}
                                onChange={(e)=> setJobTitle(e.target.value)}/>

                             <TextField
                                required
                                label="Job Skillsets"
                                defaultValue={jobSkillSet}
                                multiline
                                rows={4}
                                onChange={handleJobSkillSet}/>

                            
                            <TextField
                                required
                                label="Job Description"
                                defaultValue={jobDescription}
                                multiline
                                rows={4}
                                onChange={(e)=> setJobDescription(e.target.value)}/>

                            <Button variant="contained" 
                                onClick={handleJobPostingEditSubmit}
                                >
                                Submit
                            </Button>
                            <Button variant="contained" 
                                onClick={() => {closeEditSection(false)}}
                                >
                                Close
                            </Button>
                        </div>
                    </form>
                ) : ""
            }
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
                    
                </form>
                )
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
                                
                                width: 1500,
                                height: 450
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
                                                job.skillSets && job.skillSets.map((skill) =>{
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
                                    <JobPostingInterviewList jobid={job._id} empolyerid={localStorage.getItem('userid')}/>
                                </CardContent>
                                <div className='btns'>
                                <Button variant="contained" 
                                        color="success" 
                                        onClick={() => handleEditSection(job._id, job.employerId, job.companyName, job.jobTitle, job.skillSets ,job.jobDescription)}
                                        >
                                    Edit
                                </Button>

                                <Button variant="contained" 
                                        color= "error"
                                        onClick={() => adminHandleRemoveJob(job._id)}
                                        >
                                    Remove
                                </Button>
                            </div>

                        </Card>
                    )
                })
            }
        </>
    )
}
