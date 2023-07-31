import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../Service/api';
import Navbar from '../Home/Navbar/navbar';

export default function AdminEmployers() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [candidatesList, setCandidatesList] = useState([])

    useEffect(() => {

        const role = localStorage.getItem('userRole');

        console.log(role);

        if(role && role.toLowerCase()  === 'admin') {
            setIsAdmin(true)
        }

        // render all candidates
        if(isAdmin) {
            ApiFun.getApi(`/admin/candidates`).then((res) => {
                console.log(res.data);
                setCandidatesList([...res.data.result])
            })
            .catch((err) => {
                console.error(err)
            });
        }
        
    },[isAdmin])

    const handleCandidateApplications = (id) => {
        //event.preventDefault();
        console.log("show candidate applications");
        localStorage.setItem('adminCandidateId', id);

        window.location.href = "/candidate/applications";
    };

    const handleModifyCandidate = (id) => {
        //event.preventDefault();
        console.log("modify candidate");
        localStorage.setItem('adminCandidateId', id);
        console.log('id', id);

        window.location.href = "/profile";
    };

    const handleEraseCandidate = (userIds) => {
        // erase candidate
        console.log("erase candidate");
        setCandidatesList(candidatesList.filter(candidate => candidate._id !== userIds));

        ApiFun.deleteApi(`/admin/users?userIds=${userIds}`).then((e) => {
            console.log(e)}
        ).then((err) => {
            console.log(err);
        });

        ApiFun.deleteApi(`/candidate/${userIds}`).then((e) => {
            console.log(e)}
        ).then((err) => {
            console.log(err);
        });
    };

    //localStorage.setItem('userid', e.data.id);

    return (
        <div>
        <Navbar/>
        <h1>
            {candidatesList.map(((job) => (
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
                    <CardContent style={{flexGrow: 1}}>
                        <Typography gutterBottom variant="h5" component="div">
                            Id: {job._id}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Email: {job.email}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Name: {job.first_name} {job.last_name}
                        </Typography>
                    </CardContent>

                        <Button variant="contained" style={{marginRight: "10px"}}
                            color="success" onClick={() => handleCandidateApplications(job._id)}
                            >
                            Applications
                        </Button>

                        <Button variant="contained" style={{marginRight: "10px"}}
                            color="warning" onClick={() => handleModifyCandidate(job._id)}
                            >
                            Modify
                        </Button>

                        <Button variant="contained" 
                            color="error" onClick={() => handleEraseCandidate(job._id)}
                            >
                            Erase
                        </Button>
                </Card>
            )))}
        </h1>
    </div>
    );
}