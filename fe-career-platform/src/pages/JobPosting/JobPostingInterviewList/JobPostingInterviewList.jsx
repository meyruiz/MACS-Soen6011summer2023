import { Button } from "@mui/material";
import { Component, useEffect, useState } from "react";
import "./JobPostingInterviewList.css"
import ApiFun from "../../../Service/api";

export default function JobPostingInterviewList(props)  {
    // to do reload of the job status
    
    const [interviewerData, setInterviewerData] = useState([])
    useEffect(() => {
        const employer_id = localStorage.getItem('userid');
        const job_id = props.jobid;

        ApiFun.getApi(`/employer/${employer_id}/jobs/${job_id}/candidates`).then((res) => {
            if(res.data.status === 200){
                console.log(res.data.result)
                
                setInterviewerData([...res.data.result])

                res.data.result.forEach(data => {
                    if(data.status === "accepted") {
                        console.log("accepted",data.application_id)
                        setAccpetedList([{applicationID: data.application_id}])
                    } else if(data.status === 'rejected') {
                        console.log("rejected",data.application_id)
                        setRejectedList([{applicationID: data.application_id}])
                    }
                })
            }
        });
    },[])


    const [acceptedList, setAccpetedList] = useState([])
    const [rejectedList, setRejectedList] = useState([])

    const handleAccepct = (application_id) => {
        const accpet = { status: "accepted" }
        ApiFun.putApi(`/employer/application/${application_id}/update`, accpet).then((res) => {
            console.log(res.data)
            if(res.status === 200){
                setAccpetedList([...acceptedList, res.data])
            }
        });
        console.log(acceptedList);
    }

    const handleReject = (application_id) => {
        const accpet = { status: "rejected" }
        ApiFun.putApi(`/employer/application/${application_id}/update`, accpet).then((res) => {
            console.log(res.data)
            if(res.status === 200){
                setRejectedList([...acceptedList, res.data])
            }
        });
        console.log(rejectedList);
    }

    const findInAccpetList = (interviewerID) => {
        return acceptedList.find(accept => accept.applicationID === interviewerID)
    }

    const findInRejectedList = (interviewerID) => {
        return rejectedList.find(accept => accept.applicationID === interviewerID)
    }


    return (
        <>
        {/* <h1>{props.jobid}</h1> */}
        {interviewerData.map((interviewer) => {
            return (
                <div className="line" key={interviewer.application_id}>
                    <div className="font">Candidate : {interviewer.candidate.first_name + interviewer.candidate.last_name}</div>
                    <div className="btn">
                        <Button 
                            variant="contained" 
                            color={findInAccpetList(interviewer.application_id) ? "secondary" : "success"}
                            onClick={() => handleAccepct(interviewer.application_id)}
                            disabled={findInRejectedList(interviewer.application_id) ?  true: false }
                            >
                            {findInAccpetList(interviewer.application_id) ? "Accepted" : "Accept"}   
                        </Button>


                        <Button 
                            variant="contained" 
                            color={findInRejectedList(interviewer.application_id) ? "secondary" : "error"}
                            onClick={() => handleReject(interviewer.application_id)}
                            disabled={findInAccpetList(interviewer.application_id) ?  true: false }
                            >
                            {findInRejectedList(interviewer.application_id) ? "Rejected" : "Reject"}
                        </Button>
                    </div>
                </div>
            )
        })}
        </>
    );
    
}


 