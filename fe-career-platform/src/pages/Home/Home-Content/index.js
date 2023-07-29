import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../../Service/api';
import Navbar from '../../Home/Navbar/navbar'

export default function CandidateApplications() {
    const [isStudent, setIsStudent] = useState(false);
    const [allAvailableJobs, setallAvailableJobs] = useState([])
    const [allJobsFetched, setAllJobsFetched] = useState(false);

    // Fetch all available jobs when the page loads
    useEffect(() => {
        const role = localStorage.getItem('userRole')
        if(role && role.toLowerCase()  === 'candidate') {
            setIsStudent(true)
        }

        ApiFun.getApi("/jobs/all")
            .then((res=> {
                setallAvailableJobs(res.data)
                setAllJobsFetched(true);
            }))
            .catch((err) => {
                console.error(err)
            });
    }, [])

    useEffect(() => {
        if(isStudent && allJobsFetched) {
            const candidateId = localStorage.getItem("userid");
            ApiFun.getApi(`/candidate/${candidateId}/jobs`).then((e) => {
                console.log(e)
                const appliedJobIds = e.data.map(job => job._id);
                const updatedJobs = allAvailableJobs.map(job => {
                    if (appliedJobIds.includes(job._id)) {
                        return {...job, alreadyApplied: true};
                    }
                    return job;
                });
                setallAvailableJobs(updatedJobs);
                console.log(updatedJobs);
            })
        }
    }, [isStudent, allJobsFetched])

    const handleApply = (job_id) => {
        const updatedJobs = allAvailableJobs.map(job => {
            if (job_id == job._id) {
                return {...job, alreadyApplied: true};
            }
            return job;
        });
        setallAvailableJobs(updatedJobs);
        
        const candidate_id = localStorage.getItem('userid');
        const url = `/candidate/${candidate_id}/apply/${job_id}`
        ApiFun.postApi(url).then((e) => {
            console.log(e);
        }).catch((err)=>{
            console.log(err);
        })
    }

    return (
        <div>
        <h1>
            {allAvailableJobs.map(((job) => (
                <Card className='card'
                sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    
                    marginTop: 5,
                    marginLeft: 5,
                    
                    width: 1000,
                    height: 150
                    }}
                    key={job._id}
                    >
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Company Name: {job.companyName}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Job Title: {job.jobTitle}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Job Description: {job.jobDescription}
                        </Typography>
                    </CardContent>
                    {isStudent && (
                        <Button variant="contained" 
                                color={job.alreadyApplied ? "secondary" : "success" }
                                onClick={() => handleApply(job._id)}>
                            {job.alreadyApplied ? "Applied" : "Apply" }
                        </Button>
                    )}
                </Card>
            )))}
        </h1>
    </div>
    );
}