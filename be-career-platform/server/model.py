import uuid

from .extensions import mongo
from flask_login import UserMixin
from .extensions import bcrypt
from flask import session
from datetime import datetime
import json


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
            if role.lower() == "candidate":
                Candidate(email=email, password=password, role=role, _id=new_user._id).save_to_mongo()
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
    def __init__(self, employerId, jobTitle, jobDescription, companyName,skillSets,_id=None):
        self.employerId = employerId
        self.jobTitle = jobTitle
        self.jobDescription = jobDescription
        self.companyName = companyName
        self.skillSets = skillSets
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
        jobs = mongo.db.jobs.find({"employerId":employerId})
        return jobs

    @classmethod
    def get_allJobs(cls):
        return mongo.db.jobs.find()
        
        
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


    def playloadToInsert(self):
        return {
            "employerId": self.employerId,
            "_id": self._id,
            "jobTitle": self.jobTitle,
            "jobDescription": self.jobDescription,
            "companyName":self.companyName,
            "skillSets":self.skillSets,
            "creation_date": datetime.now()
        }

    def save_to_mongo(self):
        mongo.db.jobs.insert_one(self.playloadToInsert())


class Candidate(User):

    def __init__(self, email: str, password: str, role: str, first_name: str = None, 
                 last_name: str = None, phone_number: str = None, description: str = None, 
                 location: str = None, skills: str = None, previous_experience: str = None, 
                 resume_id: str = None, _id = None):
        super().__init__(email, password, role, _id)
        self.first_name = first_name
        self.last_name = last_name
        self.phone_number = phone_number
        self.description = description
        self.location = location
        self.skills = skills
        self.previous_experience = previous_experience
        self.resume_id = resume_id

    @classmethod
    def get_by_id(cls, _id):
        data = mongo.db.candidate.find_one({"_id": _id})
        if data is not None:
            return cls(**data)
        return None

    @classmethod
    def get_all(cls):
        data = mongo.db.candidate.find()
        if data is not None:
            return [cls(**candidate) for candidate in data]
        return []

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
            "status": "pending",
            "application_date": datetime.now(),
            "_id": uuid.uuid4().hex
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

            # application status returned to applied job listing
            job["status"] = app["status"]
            jobs.append(job)
        return jobs
    
    @staticmethod
    def get_applications_by_candidate(candidate_id):
        # find all the applications by the candidate
        applications = mongo.db.applications.find({"candidate_id": candidate_id})
        return applications
    
    @staticmethod
    def get_application(application_id):
        # find all the applications by the candidate
        application = mongo.db.applications.find({"_id": application_id})
        return application
    
    @classmethod
    def delete(cls, _id):
        result = mongo.db.candidate.find_one_and_delete({"_id": _id})
        if result:
            return f"Deleted document with ID: {_id}"
        else:
            raise Exception(f"No application found with ID: {_id}")
    
    def json(self):
        return {
            "email": self.email,
            "_id": self._id,
            "password": self.password,
            "role": self.role,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "description": self.description,
            "location": self.location,
            "skills": self.skills,
            "previous_experience": self.previous_experience,
            "resume_id": self.resume_id
        }

    def save_to_mongo(self):
        mongo.db.candidate.insert_one(self.json())


class Application():

    def __init__(self, candidate_id: str, job_id: str, status: str, application_date: str, _id: str = None):
        self.candidate_id = candidate_id
        self.job_id = job_id
        self.status = status
        self.application_date = application_date
        self._id = uuid.uuid4().hex if _id is None else _id
        # this construction is useless when creating an new application because you dont call it  

        # validate the status value
        # commented by@elsavid todo, my code would not work with these lines 
        # if not Status.is_valid(self.status):
        #     raise ValueError(f"Invalid status value: {self.status}")

    @classmethod
    def get_by_id(cls, _id):
        data = mongo.db.applications.find_one({"_id": _id})
        if data is not None:
            return cls(**data)
        return None

    @classmethod
    def get_by_candidate_id(cls, candidate_id):
        data = mongo.db.applications.find({"candidate_id": candidate_id})
        if data is not None:
            return [cls(**app) for app in data]
        return []

    @classmethod
    def get_by_job_id(cls, job_id):
        data = mongo.db.applications.find({"job_id": job_id})
        if data is not None:
            return [cls(**app) for app in data]
        return []

    @classmethod
    def update_status(cls, _id, new_status):
        filter = {"_id": _id}
        update = {"$set": {"status": new_status}}

        # # validate the new status value
        # if not Status.is_valid(new_status):
        #     raise ValueError(f"Invalid status value: {new_status}")
        
        result = mongo.db.applications.update_one(filter, update)
        return result

    @classmethod
    def delete(cls, _id):
        result = mongo.db.applications.find_one_and_delete({"_id": _id})
        if result:
            return f"Deleted document with ID: {_id}"
        else:
            raise Exception(f"No application found with ID: {_id}")
    
    @classmethod
    def application_count(cls, job_id):
        applicationcount = mongo.db.applications.find({'job_id':job_id})
        applications= list(applicationcount)
        totalcount = len(applications)
        return (totalcount)
        

    def json(self):
        return {
            "candidate_id": self.candidate_id,
            "job_id": self.job_id,
            "status": self.status,
            "application_date": self.application_date,
            "_id": self._id
        }

    def save_to_mongo(self):
        mongo.db.applications.insert_one(self.json())


class Status():
    # define some constants for the status values
    PENDING = "pending"
    INTERVIEW = "interview"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

    @classmethod
    def is_valid(cls, status):
        # check if a given status value is valid
        return status in [cls.PENDING, cls.ACCEPTED, cls.ACCEPTED, cls.REJECTED]


class Resume():

    def __init__(self, first_name: str, last_name: str, email: str, phone: str = None, education: list[dict] = None, skills: list[str] = None, experience: list[dict] = None, file: dict = None, _id: str = None, candidate_id: str = None):
        # initialize the common attributes of the resume object
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone
        self.education = education
        self.skills = skills
        self.experience = experience
        self.file = file
        self.candidate_id = candidate_id
        self._id = uuid.uuid4().hex if _id is None else _id

    @classmethod
    def get_by_id(cls, _id):
        # find a resume document by its ID in the database
        data = mongo.db.resumes.find_one({"_id": _id})
        if data is not None:
            return data
        return None
    
    @classmethod
    def get_by_candidate_id(cls, candidate_id):
        # find a resume document by its ID in the database
        data = mongo.db.resumes.find_one({"candidate_id": candidate_id})
        
        if data is not None:
            return data
        return None

    @classmethod
    def get_by_email(cls, email):
        # find a resume document by the email of the candidate
        data = mongo.db.resumes.find_one({"email": email})
        if data is not None:
            return data
        return None
    
    def json(self):
        # return a dictionary representation of the dynamic resume object
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "education": self.education,
            "skills": self.skills,
            "experience": self.experience,
            "file": self.file,
            "candidate_id": self.candidate_id,
            "_id": self._id
        }

    def save_to_mongo(self):
        # insert a resume document into the database using the json method
        mongo.db.resumes.insert_one(self.json())
