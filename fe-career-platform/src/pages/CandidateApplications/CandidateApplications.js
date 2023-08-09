import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../Service/api';
import Navbar from '../Home/Navbar/navbar';
import './CandidateApplications.css'

export default function CandidateApplications() {
    const [isStudent, setIsStudent] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([])
    const [applicationsFetched, setApplicationsFetched] = useState(false);

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
                setApplicationsFetched(true);
                
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
            {applicationsFetched == true && (
            <div>
                {appliedJobs.length > 0 && appliedJobs.map(((job) => (
                    <Card className='card' style={{maxHeight: '400px', height:"unset"}}
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
                        <CardContent  style={{flexGrow: 1}}>
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
                        
                        <Button className='status' variant="contained"
                            color={job.status === "accepted" ? "success" : job.status === "pending" ? "warning" : job.status === "rejected" ? "error" : "info"}
                            >
                            <span>{job.status}</span>
                        </Button>
                        
                    </Card>
                )))}
                {appliedJobs.length === 0 && (<div className='message'><h3>No applications done yet</h3></div>)}
            </div>)}
            {applicationsFetched == false && (<div className='message'><h3>Loading...</h3></div>)} 
        </h1>
    </div>
    );
}