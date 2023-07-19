import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../../Service/api';

const fakerData = [
    {
        postingId: 'asdasdasdasdasdasd',
        companyName: 'Google Inc',
        title: 'Full Stack Developer',
        location: 'remote',
        salary: '100~150K',
        skillSets: ['Web progarmming', '10+ Working experience'],
        description: "ahjsoidljaoilsjdoliasjdliajsdljasldjaljdslkjadlkajslkdjlaksjdlkajdslkjalkdjsalkdjlakjdlkajdslkjalkdjlskajdlkajdlkajdlkjalkjd"
    },
    {
        postingId: 'asdasdkajshdkajhsdkjhaskjdhkajshdkj',
        companyName: 'Faker Inc',
        title: 'Full Stack Developer',
        location: 'remote',
        salary: '100~150K',
        skillSets: ['Web progarmming', '10+ Working experience'],
        description: "ahjsoidljaoilsjdoliasjdliajsdljasldjaljdslkjadlkajslkdjlaksjdlkajdslkjalkdjsalkdjlakjdlkajdslkjalkdjlskajdlkajdlkajdlkjalkjd"
    },
]

export default function HomeContent() {
    const [isStudent, setIsStudent] = useState(false);
    const [allAvailableJobs, setallAvailableJobs] = useState([])
    useEffect(() => {
        const loggedInUserID = localStorage.getItem("userid");
        console.log(loggedInUserID);

        // check if the user is Candidate
        const role = localStorage.getItem('userRole')
        if(role === 'Candidate') {
            setIsStudent(true)
        }

        // render all available jobs
        ApiFun.getApi("/jobs/all")
            .then((res=> {
                // console.log(res.data);
                setallAvailableJobs([...allAvailableJobs, ...res.data])
            }))
            .catch((err) => {
                console.error(err)
            });
        
        // get the
    },[])

    const [appliedJobs, setAppliedJobs] = useState([])
    const handleApply = (jobID) => {
        setAppliedJobs([...appliedJobs, jobID])
        // console.log("handleApply -- ",jobId)
        // ApiFun.postApi("/candidate/apply/<job_id>")
        
    }

    const isInAppliedJobsList = (jobID) => {
        // console.log(appliedJobs);
        return appliedJobs.find(job => job === jobID)
    }

    return (
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
                    {/* <Typography gutterBottom variant="h5" component="div">
                        Location: {job.location}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        Relatice Skills: {job.skillSets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {job.description}
                    </Typography> */}
                </CardContent>
                {isStudent && (
                    <Button variant="contained" 
                            color={isInAppliedJobsList(job._id) ? "secondary" : "success" }
                            onClick={() => handleApply(job._id)}>
                        {isInAppliedJobsList(job._id) ? "Applied" : "Apply" }
                    </Button>
                )}
            </Card>
        )))}
    </h1>
    );
}