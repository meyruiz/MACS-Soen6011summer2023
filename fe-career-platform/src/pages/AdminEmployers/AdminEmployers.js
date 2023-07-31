import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../Service/api';
import Navbar from '../Home/Navbar/navbar';
import './AdminEmployers.css';

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
            ApiFun.getApi(`/admin/users?role=candidate`).then((res) => {
                console.log(res.data);
                setCandidatesList([...res.data])
            })
            .catch((err) => {
                console.error(err)
            });
        }
        
    },[isAdmin])

    const handleEraseEmployer = (id) => {
        // erase candidate
        console.log("erase candidate");
        setCandidatesList(candidatesList.filter(candidate => candidate._id !== id));

        ApiFun.deleteApi(`/admin/users?userIds=${id}`).then((e) => {
            console.log(e)}
        ).then((err) => {
            console.log(err);
        });
    };

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
                        {/* <Typography gutterBottom variant="h5" component="div">
                            Name: {job.first_name} {job.last_name}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Location: {job.location}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Skills: {job.skills}
                        </Typography> */}
                    </CardContent>
                        <Button variant="contained" 
                            color="error" onClick={() => handleEraseEmployer(job._id)}
                            >
                            Erase
                        </Button>
                </Card>
            )))}
        </h1>
    </div>
    );
}