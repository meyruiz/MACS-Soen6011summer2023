import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../Service/api';
import Navbar from '../Home/Navbar/navbar';
import './AdminEmployers.css';

export default function AdminEmployers() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [employersList, setEmployersList] = useState([])

    useEffect(() => {

        const role = localStorage.getItem('userRole');

        console.log(role);

        if(role && role.toLowerCase()  === 'admin') {
            setIsAdmin(true)
        }

        // render all employers
        if(isAdmin) {
            ApiFun.getApi(`/admin/users?role=employer`).then((res) => {
                console.log(res.data);
                setEmployersList([...res.data])
            })
            .catch((err) => {
                console.error(err)
            });
        }
        
    },[isAdmin])

    const handleEraseEmployer = (id) => {
        // erase candidate
        console.log("erase candidate");
        setEmployersList(employersList.filter(candidate => candidate._id !== id));

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
            {employersList.map(((job) => (
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