from .extensions import mongo
from flask import Blueprint,request, flash, jsonify
from flask_login import login_required, current_user
from .model import User, JobPosting, Application, Candidate
from bson import json_util
from urllib.parse import parse_qs
import json

#Employer Endpoint
employer = Blueprint('employer', __name__)


def notEmployerRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role.lower() != "employer":
        return True
    return False 

@employer.route('/employer/index')
@login_required
def index():
    if notEmployerRole():
        return jsonify(status=403, msg="You are not an employer.")
    return "in employer index"

@employer.route('/employer/profile')
@login_required
def profile():
    if notEmployerRole():
        return jsonify(status=403, msg="You are not an employer.")
    return "in employer profile"


#Support Post a Job
@employer.route('/employer/post/<employerId>', methods=['POST'])
def postJob(employerId):
    try:
        print(request.json)
        jobTitle = request.json["jobTitle"]
        jobDescription = request.json["jobDescription"]
        companyName = request.json["companyName"]
        skillSets = request.json["skillSets"]
        skillSets = list(skillSets)
        job = JobPosting(employerId,jobTitle,jobDescription,companyName,skillSets)
        job.save_to_mongo()
        flash(f'Job created for {jobTitle}!', 'success')
        return {"jobId": job.get_jobId()}, 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

#Support get Job by JobId
@employer.route('/employer/<employer_id>/<job_id>', methods=['GET'])
def getJobByJobId(employer_id,job_id):

    user = mongo.db.users.find_one({"_id": employer_id})
    #Autherization
    if user == None:
        flash('Not logined', 'danger')
        return "failed authentication"


    job = JobPosting.get_jobBYJobId(job_id)
    return jsonify(str(job)), 200

#Get a list of jobs
@employer.route('/employer/<employer_id>/jobs', methods=['GET'])
def getJobsByEmployerId(employer_id):
    jobLists = JobPosting.get_jobListsBYEmployerId(employer_id)
    return jsonify(list(jobLists)) , 200

#Support update any job information
@employer.route('/employer/<employer_id>/<job_id>', methods=['PUT'])
def updateJob(employer_id,job_id):
    try: 
        fields = ["jobTitle","jobDescription","companyName","skillSets"]
        updateInfo = {}
        json_keys = list(request.json.keys()) if request.is_json else []
        
        for key in json_keys:
            if key not in fields:
                raise Exception(key)
            else:
                updateInfo[key] = request.json[key]
        result = JobPosting.put(job_id,updateInfo)
        return {"jobId": job_id}, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

#support delete a job by id 
@employer.route('/employer/<employer_id>/<job_id>', methods=['DELETE'])
def deleteJob(employer_id,job_id):
    try:
        JobPosting.delete(job_id)
        #delete all application
        mongo.db.applications.delete_many({"job_id": job_id})
        return {"jobId": job_id}, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

#Query jobs 
@employer.route('/jobs/all', methods=['GET'])
def findAllJobs():
    try:
        #Extract query lists
        query_string = request.query_string
        parsed_query = parse_qs(query_string)
        print(parsed_query)
        filter_query = {}
        for param, values in parsed_query.items():
            param = param.decode("utf-8")
            if len(values) == 1:
                value = values[0].decode("utf-8")
                filter_query[param] = value
        
            else:
                values_str = [value.decode("utf-8") for value in values]
                filter_query[param] = {"$all": values_str}
        print(filter_query)

        #find filtered jobs
        jobs = mongo.db.jobs.find(filter_query)
        records = list(jobs)
        records_list = [record for record in records]
        return jsonify(records_list) , 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@employer.route('/employer/application/<application_id>/update', methods=['PUT'])
def changeApplicationStatusByEmployer(application_id):
    try:
        status = request.json["status"]
        if  status in ["interview","rejected","accepted"]:
            result = Application.update_status(application_id,status)
            return {"applicationID": application_id}, 200
        else:
            return jsonify({'error': 'not valid status'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@employer.route('/employer/<employer_id>/jobs/<job_id>/candidates', methods=['GET'])

def findAllCandidatesForOneJob(employer_id, job_id):
    current_user_id = employer_id
    job = JobPosting.get_jobBYJobId(job_id)
    if job is None:
        return jsonify(status=404, msg="Job is not found.")
    if job["employerId"] != current_user_id:
        return jsonify(status=403, msg="You are not the owner of this job posting.")
    applications = Application.get_by_job_id(job_id)
    apps = []
    for x in applications:
        can = Candidate.get_by_id(x.candidate_id)
        if can is None:
            apps.append({
                "candidate": None,
                "job_id": x.job_id,
                "status": x.status,
                "application_date": x.application_date,
                "application_id": str(x._id),
            }) 
        else:
            apps.append({
                "candidate": {
                    "_id": x.candidate_id,
                    "email": can.email,
                    "first_name": can.first_name,
                    "last_name": can.last_name,
                    "phone_number": can.phone_number,
                    "description": can.description,
                    "location": can.location,
                    "skills": can.skills,
                    "previous_experience": can.previous_experience,
                },
                "job_id": x.job_id,
                "status": x.status,
                "application_date": x.application_date,
                "application_id": str(x._id),
            })
    return jsonify(status=200, result=apps)

#get application by id
@employer.route('/application/<application_id>', methods=['GET'])
def getApplicationByApplicationId(application_id):
    application = mongo.db.applications.find_one({"_id":application_id})
    return jsonify(application), 200

#get a list of application belongs to one job
@employer.route('/employer/applications/job/<job_id>', methods=['GET'])
def getApplicationsByJobId(job_id):
    try:
        applications = mongo.db.applications.find({'job_id':job_id})
        records = list(applications)
        job = JobPosting.get_jobBYJobId(job_id)
        response = {}
        response["jobInformation"] = job
        response["numberOfApplications"] = len(records)
        return jsonify(response) , 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

#get a list of application of jobs posted by one employer 
@employer.route('/employer/<employer_id>/applications/all', methods=['GET'])
def findAllApplicationsByEmployerId(employer_id):
    # try: 
    jobs = JobPosting.get_jobListsBYEmployerId(employer_id)
    records = list(jobs)
    jobs = [record  for record in records]
    response = []
    for job in jobs:
        print(str(job))
        jobID = job["_id"]
        print(jobID+"dd")
        applications = mongo.db.applications.find({'job_id':jobID})
        record = {}
        record.update({
            "jobInformation": job,
            "numberOfApplications":len(list(applications))
        })
        response.append(record)
    return jsonify(response) , 200
