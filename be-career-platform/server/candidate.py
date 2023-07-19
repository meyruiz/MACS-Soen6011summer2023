from .extensions import mongo
from flask import Blueprint, jsonify, request, make_response
from flask_login import login_required, current_user
from .model import JobPosting, User, Candidate

candidate = Blueprint('candidate', __name__)

def notCandidateRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role != "candidate":
        return True
    return False 


@candidate.route('/candidate/index', methods=['GET'])
@login_required
def index():
    if notCandidateRole():
        return "You are not a candidate."
    return "in candidate index"


@candidate.route('/candidate/profile', methods=['GET'])
@login_required
def get_profile():
    if notCandidateRole():
        return "You are not a candidate."
    # get the current user as a candidate object
    candidate = Candidate.get_by_id(current_user.get_id())
    # return the candidate data as JSON with status code 200
    return jsonify(candidate.json()), 200


@candidate.route('/candidate/profile', methods=['PUT'])
@login_required
def create_profile():
    if notCandidateRole():
        return "You are not a candidate."
    # get the JSON data from the request
    data = request.json

    # validate the data (you can add more checks here)
    if not data:
        return "No data provided", 400
    
    # create a new candidate object with the data
    candidate = Candidate(**data)

    # save the candidate object to the database
    candidate.save_to_mongo()

    # return the candidate data as JSON with status code 201
    return jsonify(candidate.json()), 201


@candidate.route('/candidate/profile', methods=['POST'])
@login_required
def update_profile():
    if notCandidateRole():
        return "You are not a candidate."
    # get the current user as a candidate object
    candidate = Candidate.get_by_id(current_user.get_id())
    
    # get the JSON data from the request
    data = request.json

    # validate the data (you can add more checks here)
    if not data:
        return "No data provided", 400
    
    # update the candidate object with the new data
    for key, value in data.items():
        setattr(candidate, key, value)
    
    # update the document in the database
    filter = {"_id": candidate._id}
    update = {"$set": candidate.json()}
    result = mongo.db.candidates.update_one(filter, update)

    # create a custom response with a success message and status code 200
    response = make_response("Profile updated successfully", 200)

    return response


@candidate.route('/candidate/apply/<job_id>', methods=['POST'])
@login_required
def apply(job_id):
    if notCandidateRole():
        return "You are not a candidate."
    # get the current user as a candidate object
    candidate = Candidate.get_by_id(current_user.get_id())
    # try to apply to the job with the given id
    result = candidate.apply_to_job(job_id)
    if result:
        return "You have successfully applied to the job."
    else:
        return "You have already applied to this job or the job does not exist."


@candidate.route('/candidate/employer/<employer_id>', methods=['GET'])
@login_required
def get_jobs_by_employer(employer_id):
    if notCandidateRole():
        return "You are not a candidate."
    # get the list of jobs by a given employer
    jobs = JobPosting.get_jobListsBYEmployerId(employer_id)
    # return the jobs as JSON with status code 200
    return jsonify(jobs), 200


@candidate.route('/candidate/jobs', methods=['GET'])
@login_required
def get_applied_jobs():
    if notCandidateRole():
        return "You are not a candidate."
    # get the current user as a candidate object
    candidate = Candidate.get_by_id(current_user.get_id())
    # get the list of jobs that the candidate has applied to
    jobs = candidate.get_applied_jobs()
    return jsonify(jobs)
