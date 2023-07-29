import json
from .extensions import mongo
from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from .model import JobPosting, Resume, User, Candidate, Application
from pymongo import ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import dumps

candidate = Blueprint('candidate', __name__)

def notCandidateRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role.lower() != "candidate":
        return True
    return False 


@candidate.route('/candidate/index', methods=['GET'])
# @login_required
def index():
    if notCandidateRole():
        return "You are not a candidate."
    return "in candidate index"


@candidate.route('/candidate/profile/<candidate_id>', methods=['GET'])
# @login_required
def get_profile(candidate_id):
    # get the candidate object by id
    candidate = Candidate.get_by_id(candidate_id)
    # check if the candidate object exists
    if not candidate:
        # return a 404 not found error
        abort(404, "Candidate not found")
    # return the candidate data as JSON with status code 200
    return jsonify(candidate.json()), 200


@candidate.route('/candidate/profile', methods=['POST'])
# @login_required
def create_profile():
    data = request.json

    # validate the data (can add more checks here)
    if not data:
        return "No data provided", 400
    
    # filter the data dictionary by keeping only the keys that are in the dir() list of the Candidate class
    candidate = Candidate(email="", password="", role="")

    data = {key: value for key, value in data.items() if hasattr(candidate, key)}
    
    # create a new candidate object with the data
    candidate = Candidate(**data)

    # save the candidate object to the database
    candidate.save_to_mongo()

    # return the candidate data as JSON with status code 201
    return jsonify(candidate.json()), 201


@candidate.route('/candidate/profile/<candidate_id>', methods=['POST'])
# @login_required
def update_profile(candidate_id):
    # check if the candidate_id is valid
    if not candidate_id:
        return "No candidate id provided", 400
    # get the candidate object by id
    candidate = Candidate.get_by_id(candidate_id)

    # check if the candidate object exists
    if not candidate:
        # return a 404 not found error
        abort(404, "Candidate not found")
    
    # get the JSON data from the request
    data = request.json

    # validate the data (you can add more checks here)
    if not data:
        return "No data provided", 400
    
    # update the candidate object with the new data
    for key, value in data.items():
        setattr(candidate, key, value)
    
    # update and return the document in the database
    # Define the filter and update expressions
    filter_expression = {"_id": candidate_id}
    update_data = candidate.json()
    update_data.pop('_id', None)  # remove the _id field from the update data
    update_expression = {"$set": update_data}

    # Update the document
    updated_document = mongo.db.candidate.find_one_and_update(
        filter_expression, update_expression, return_document=ReturnDocument.AFTER
    )

    # create a custom response with the updated document, a success message and status code 200
    response = jsonify({"candidate": updated_document, "message": "Candidate profile updated successfully"})
    response.status_code = 200
    return response


@candidate.route('/candidate/<candidate_id>/apply/<job_id>', methods=['POST'])
# @login_required
def apply(candidate_id, job_id):
    # check if the candidate_id is valid
    if not candidate_id:
        return "No candidate id provided", 400
    # get the candidate object by id
    candidate = Candidate.get_by_id(candidate_id)
    # check if the candidate object exists
    if not candidate:
        # return a 404 not found error
        abort(404, "Candidate not found")
    
    # try to apply to the job with the given id
    result = candidate.apply_to_job(job_id)
    if result:
        # create a custom response with a success message and status code 200
        response = jsonify({"message": "You have successfully applied to the job."})
        response.status_code = 200
        return response
    else:
        # create a custom response with a failure message and status code 200
        response = jsonify({"message": "You have already applied to this job or the job does not exist."})
        response.status_code = 200
        return response


@candidate.route('/candidate/<candidate_id>/employer/<employer_id>', methods=['GET'])
# @login_required
def get_jobs_by_employer(candidate_id, employer_id):
    # check if the candidate_id is valid
    if not candidate_id:
        return "No candidate id provided", 400
    # get the candidate object by id
    candidate = Candidate.get_by_id(candidate_id)
    # check if the candidate object exists
    if not candidate:
        # return a 404 not found error
        abort(404, "Candidate not found")
    # get the list of jobs by a given employer
    jobs = list(JobPosting.get_jobListsBYEmployerId(employer_id))
    jobs = [json.loads(dumps(job)) for job in jobs]
    # return the jobs as JSON with status code 200
    return jsonify(jobs)


@candidate.route('/candidate/<candidate_id>/jobs', methods=['GET'])
# @login_required
def get_applied_jobs(candidate_id):
    # check if the candidate_id is valid
    if not candidate_id:
        return "No candidate id provided", 400
    # get the candidate object by id
    candidate = Candidate.get_by_id(candidate_id)
    # check if the candidate object exists
    if not candidate:
        # return a 404 not found error
        abort(404, "Candidate not found")
    # get the list of jobs that the candidate has applied to
    jobs = candidate.get_applied_jobs()
    jobs = list(jobs)
    jobs = [json.loads(dumps(job)) for job in jobs]
    return jsonify(jobs)


@candidate.route('/candidate/<candidate_id>/resume', methods=['POST'])
# @login_required
def create_resume(candidate_id):
    resume_file_data = request.json
    # check if the candidate_id is valid
    if not candidate_id:
        return "No candidate id provided", 400
    # get the candidate object by id
    candidate = Candidate.get_by_id(candidate_id)

    # check if the candidate object exists
    if not candidate:
        # return a 404 not found error
        abort(404, "Candidate not found")

    data = candidate.json()
    data.pop("_id", None)
    # filter the data dictionary by keeping only the keys that are in the dir() list of the Resume class
    resume = Resume(first_name="", last_name="", email="")

    data = {key: value for key, value in data.items() if hasattr(resume, key)}
    data["file"] = resume_file_data
    data["candidate_id"] = candidate_id
    # create a new resume object with the data
    resume = Resume(**data)

    # save the candidate object to the database
    resume.save_to_mongo()
    resume_id = resume._id

    filter_expression = {"_id": candidate_id}
    update_data = candidate.json()
    update_data.pop('_id', None)  # remove the _id field from the update data
    update_data['resume_id'] = resume_id
    update_expression = {"$set": update_data}

    # Update the document
    updated_document = mongo.db.candidate.find_one_and_update(
        filter_expression, update_expression, return_document=ReturnDocument.AFTER
    )

    # return the candidate data as JSON with status code 201
    return jsonify(resume.json()), 201


@candidate.route('/candidate/<candidate_id>/resume', methods=['GET'])
# @login_required
def get_resume(candidate_id):
    # get the candidate object by id
    resume = Resume.get_by_candidate_id(candidate_id)
    # check if the candidate object exists
    if not resume:
        # return a 404 not found error
        abort(404, "Candidate not found")
    # return the candidate data as JSON with status code 200
    return jsonify(resume), 200


@candidate.route('/candidate/resume/<resume_id>', methods=['GET'])
# @login_required
def get_resume_by_id(resume_id):
    # get the candidate object by id
    resume = Resume.get_by_id(resume_id)
    # check if the candidate object exists
    if not resume:
        # return a 404 not found error
        abort(404, "Candidate not found")
    # return the resume data as JSON with status code 200
    return jsonify(resume), 200


@candidate.route('/candidate/<candidate_id>/applications', methods=['GET'])
# @login_required
def get_candidate_applications(candidate_id):
    # check if the candidate_id is valid
    if not candidate_id:
        return "No candidate id provided", 400

    # get applications
    applications = Candidate.get_applications_by_candidate(candidate_id)

    # return the jobs as JSON with status code 200
    applications = [json.loads(dumps(application)) for application in applications]
    return jsonify(applications)


@candidate.route('/candidate/applications/<application_id>', methods=['GET'])
# @login_required
def get_candidate_application(application_id):

    application = Candidate.get_application(application_id)

    if not application:
        # return a 404 not found error
        abort(404, "Application not found")
    # return the application data as JSON with status code 200
    return jsonify(json.loads(dumps(application))), 200

