import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../Service/api';
import Navbar from '../Home/Navbar/navbar';

export default function CandidateApplications() {
    const [isStudent, setIsStudent] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([])

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        let candidate_id;

        if(role && role.toLowerCase()  === 'admin') {
            candidate_id = localStorage.getItem('adminCandidateId');
        } else {
            candidate_id = localStorage.getItem('userid');
        }

        // render all applications that the candidate has applied to
        if(candidate_id) {
            ApiFun.getApi(`/candidate/${candidate_id}/jobs`).then((res) => {
                // console.log(res.data);
                if (res.data) {
                    res.data[0].status = "Accepted";
                    // res.data[1].status = "Pending";
                    // res.data[2].status = "Rejected";
                }

                console.log(res.data);
                setAppliedJobs([...res.data])
            })
            .catch((err) => {
                console.error(err)
            });
        }
        
    },[])

    return (
        <div>
        <Navbar/>
        <h1>
            {appliedJobs.map(((job) => (
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
                    
                    <Button variant="contained" 
                        color={job.status === "Accepted" ? "success" : job.status === "Pending" ? "warning" : "error"}
                        >
                        {job.status}
                    </Button>
                    
                </Card>
            )))}
        </h1>
    </div>
    );
}