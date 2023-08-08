import { Box, Button, Card, CardActions, CardContent, FormControl, IconButton, InputLabel, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'
import ApiFun from '../../../Service/api';
import Navbar from '../../Home/Navbar/navbar'
import "./index.css"
import JobPostingInterviewList from '../../JobPosting/JobPostingInterviewList/JobPostingInterviewList';


export default function CandidateApplications() {
    const [isStudent, setIsStudent] = useState(false);
    const [allAvailableJobs, setallAvailableJobs] = useState([])
    const [allJobsFetched, setAllJobsFetched] = useState(false);


    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch all available jobs when the page loads
    useEffect(() => {
        const role = localStorage.getItem('userRole')
        if(role && role.toLowerCase()  === 'candidate') {
            setIsStudent(true)
        }

        if(role && role.toLowerCase()  === 'admin') {
            setIsAdmin(true)
        }

        ApiFun.getApi("/jobs/all")
            .then((res=> {
                console.log(res.data)
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

   

    const adminHandleRemoveJob= (jobID) => {
        setallAvailableJobs(allAvailableJobs.filter(job => job._id !== jobID));
        const admin_id = localStorage.getItem("userid");
        ApiFun.deleteApi(`/employer/${admin_id}/${jobID}`).then((e) => {
            console.log(e)}
        ).then((err) => {
            console.log(err);
        });
    }

    const [openEditSection, closeEditSection] = useState(false)
    const adminHandleEditSection = (jobID, empolyerid, companyName, jobTitle, skillSets, jobDescription) => {
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
       
        // console.log(jobTitle)
        // console.log()
        // console.log(jobDescription)
    }

    const [companyName, setCompanyName] = React.useState('');
    const [jobTitle, setJobTitle] = React.useState('');
    const [jobDescription, setJobDescription] = React.useState('');
    const [jobSkillSet, setjobSkillSet] = React.useState([]);
    const [empolyerid, setEmpolyerid] = React.useState('')
    const [jobID, setJobID] = React.useState('')

    const handleJobSkillSet = (e) => {
        const content = e.target.value;
        const res = content.split(" ");
        // console.log(res);
        setjobSkillSet([...res])
        // console.log("job", jobSkillSet);
    }

    const handleJobPostingSubmit = () => {
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearch, setIsSearched] = useState(false)
    const onHandleSearch = () => {
        console.log('onHandleSearch', searchQuery);
        setIsSearched(true)
        ApiFun.getApi(`/jobs/all?${searchCategories}=`+searchQuery).then((res) => {
            console.log(res);
            setallAvailableJobs([...res.data])
        })
        // setSearchQuery("")
    }

    const handleClearSearch = () => {
        // setSearchQuery('')
        setIsSearched(false)
        window.location.reload()
    }


    const [searchCategories, setSearchCategories] = React.useState('');
    const handleChange = (event) => {
        console.log(event.target)
        setSearchCategories(event.target.value);
      };

    return (
        <div>
            {isStudent && (
               <form className='search'>
                <Box sx={{ minWidth: 150 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Search For</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={searchCategories}
                            label="Search For"
                            onChange={handleChange}
                        >
                        <MenuItem value={"jobTitle"}>JobTitle</MenuItem>
                        <MenuItem value={"companyName"}>CompanyName</MenuItem>
                        <MenuItem value={"skillSets"}>Skill</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <TextField
                    id="search-bar"
                    className="text"
                    onInput={(e) => {
                    setSearchQuery(e.target.value);
                    }}
                    
                    variant="outlined"
                    placeholder="Search..."
                    size="large"
                />
                <div className="btn-search">
                    <Button 
                            variant="contained"
                            onClick={onHandleSearch}>
                            Search
                    </Button>
                </div>
                
                
                {isSearch && (
                    <Button onClick={handleClearSearch}>
                            Clear
                    </Button>
                )}
             </form>
            )}
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
                                onClick={handleJobPostingSubmit}
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
        <h1>
            {allAvailableJobs.map(((job) => (
                <Card style={{maxHeight: '400px', height:"unset"}} className='card'
                    sx={
                            isAdmin?{
                                boxShadow: 1,
                                borderRadius: 2,
                                
                                marginTop: 5,
                                marginLeft: 5,
                                
                                width: 1500,
                                height:450
                            } :{boxShadow: 1,
                                borderRadius: 2,
                                
                                marginTop: 5,
                                marginLeft: 5,
                                
                                width: 1500,
                                height:200} 
                            
                            
                        }
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

                            <Typography gutterBottom variant="h5" component="div">
                                Job Description: {job.jobDescription}
                            </Typography>
                            {
                                isAdmin && (
                                    <JobPostingInterviewList jobid={job._id} empolyerid={job.employerId}/>
                                )
                            }
                            

                        </CardContent>
                        {isStudent && (
                            <Button variant="contained" 
                                    color={job.alreadyApplied ? "secondary" : "success" }
                                    onClick={() => handleApply(job._id)}>
                                {job.alreadyApplied ? "Applied" : "Apply" }
                            </Button>
                        )}

                        {isAdmin && (
                            <div className='btns'>
                                <Button variant="contained" 
                                        color="success" 
                                        onClick={() => adminHandleEditSection(job._id, job.employerId, job.companyName, job.jobTitle, job.skillSets ,job.jobDescription)}>
                                    Edit
                                </Button>

                                <Button variant="contained" 
                                        color= "error"
                                        onClick={() => adminHandleRemoveJob(job._id)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </Card>
                    )
                    
                )

            )}  
        </h1>
    </div>
    );
}