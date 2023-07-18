from .extensions import mongo
from flask_login import UserMixin
from .extensions import bcrypt
from flask import session
from datetime import datetime
import uuid

class User(UserMixin):

    def __init__(self, email, password, role, _id=None):
        self.email = email
        self.password = password
        self.role = role
        self._id = uuid.uuid4().hex if _id is None else _id

    def is_authenticated(self):
        return True
    def is_active(self):
        return True
    def is_anonymous(self):
        return False
    def get_id(self):
        return self._id

    @classmethod
    def get_by_email(cls, email):
        data = mongo.db.users.find_one({"email": email})
        if data is not None:
            return cls(**data)

    @classmethod
    def get_by_id(cls, _id):
        data = mongo.db.users.find_one({"_id": _id})
        if data is not None:
            return cls(**data)
        return None

    @staticmethod
    def login_valid(email, password):
        verify_user = User.get_by_email(email)
        if verify_user is not None:
            return bcrypt.check_password_hash(verify_user.password, password)
        return False

    @classmethod
    def register(cls, email, password, role):
        user = cls.get_by_email(email)
        if user is None:
            new_user = cls(email, password, role)
            new_user.save_to_mongo()
            session['email'] = email
            return True
        else:
            return False

    def json(self):
        return {
            "email": self.email,
            "_id": self._id,
            "password": self.password,
            "role": self.role
        }

    def save_to_mongo(self):
        mongo.db.users.insert_one(self.json())

class JobPosting():
    def __init__(self, employerId, jobTitle, jobDescription, companyName, _id=None):
        self.employerId = employerId
        self.jobTitle = jobTitle
        self.jobDescription = jobDescription
        self.companyName = companyName
        self._id = uuid.uuid4().hex if _id is None else _id

    # def is_authenticated(self):
    #     return True
    # def is_active(self):
    #     return True
    # def is_anonymous(self):
    #     return False
    def get_jobId(self):
        return self._id

    @classmethod
    def get_jobBYJobId(cls,jobId):
        job = mongo.db.jobs.find_one({"_id":jobId})
        return job

    @classmethod
    def get_jobListsBYEmployerId(cls,employerId):
        job = mongo.db.jobs.find({"employerId":employerId})
        return job 
        
    @classmethod
    def put(cls, jobId,updateInfo):
        filter = {"_id": jobId}
        update = {"$set": updateInfo}
        result = mongo.db.jobs.update_one(filter, update)
        return result
    
    @classmethod
    def delete(cls,jobId):
        result = mongo.db.jobs.find_one_and_delete({"_id": jobId})
        if result:
            return f"Deleted document with ID: {jobId}"
        else:
            raise Exception(f"No job found with jobID: {jobId}")

        #todo delete associated application tracking  

    def playloadToInsert(self):
        return {
            "employerId": self.employerId,
            "_id": self._id,
            "jobTitle": self.jobTitle,
            "jobDescription": self.jobDescription,
            "companyName":self.companyName,
            "creation_date": datetime.now()
        }

    def save_to_mongo(self):
        mongo.db.jobs.insert_one(self.playloadToInsert())


class Candidate(User):

    def __init__(self, email, password, role, first_name, last_name, resume, _id=None):
        super().__init__(email, password, role, _id)
        self.first_name = first_name
        self.last_name = last_name
        self.resume = resume # a string or a file object

    def apply_to_job(self, job_id):
        # check if the job exists
        job = JobPosting.get_jobBYJobId(job_id)
        if job is None:
            return False
        # check if the candidate has already applied
        application = mongo.db.applications.find_one({"candidate_id": self._id, "job_id": job_id})
        if application is not None:
            return False
        # create a new application document
        application = {
            "candidate_id": self._id,
            "job_id": job_id,
            "resume": self.resume,
            "status": "pending",
            "application_date": datetime.now()
        }
        # insert the application into the database
        mongo.db.applications.insert_one(application)
        return True

    def get_applied_jobs(self):
        # find all the applications by the candidate
        applications = mongo.db.applications.find({"candidate_id": self._id})
        # get the job details for each application
        jobs = []
        for app in applications:
            job = JobPosting.get_jobBYJobId(app["job_id"])
            jobs.append(job)
        return jobs
