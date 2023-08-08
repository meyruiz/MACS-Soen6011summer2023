import pytest
from unittest.mock import patch
from server.model import Candidate

def test_candidate_init():
    candidate = Candidate(
        email="test@mail.com", 
        password="password", 
        role="candidate", 
        first_name="Test", 
        last_name="User", 
        phone_number="1234567890", 
        description="Test User Description", 
        location="Test Location", 
        skills=["python", "java"], 
        previous_experience="Test Experience", 
        resume_id="1234",
        _id="1234"
    )
    
    assert candidate.email == "test@mail.com"
    assert candidate.password == "password"
    assert candidate.role == "candidate"
    assert candidate.first_name == "Test"
    assert candidate.last_name == "User"
    assert candidate.phone_number == "1234567890"
    assert candidate.description == "Test User Description"
    assert candidate.location == "Test Location"
    assert candidate.skills == ["python", "java"]
    assert candidate.previous_experience == "Test Experience"
    assert candidate.resume_id == "1234"
    assert candidate._id == "1234"

@patch('server.model.Candidate.get_by_id')
def test_get_by_id(mock_get_by_id):
    mock_candidate_data = {
        "_id": "1234",
        "email": "test@mail.com",
        "password": "password",
        "role": "candidate",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "1234567890",
        "description": "Test User Description",
        "location": "Test Location",
        "skills": ["python", "java"],
        "previous_experience": "Test Experience",
        "resume_id": "1234",
    }
    mock_candidate = Candidate(**mock_candidate_data)
    mock_get_by_id.return_value = mock_candidate
    
    candidate = Candidate.get_by_id("1234")
    
    assert candidate._id == "1234"
    assert candidate.email == "test@mail.com"
    assert candidate.password == "password"
    assert candidate.role == "candidate"
    assert candidate.first_name == "Test"
    assert candidate.last_name == "User"
    assert candidate.phone_number == "1234567890"
    assert candidate.description == "Test User Description"
    assert candidate.location == "Test Location"
    assert candidate.skills == ["python", "java"]
    assert candidate.previous_experience == "Test Experience"
    assert candidate.resume_id == "1234"

@patch('server.model.Candidate.get_by_email')
def test_get_by_email(mock_get_by_email):
    mock_candidate_data = {
        "_id": "1234",
        "email": "test@mail.com",
        "password": "password",
        "role": "candidate",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "1234567890",
        "description": "Test User Description",
        "location": "Test Location",
        "skills": ["python", "java"],
        "previous_experience": "Test Experience",
        "resume_id": "1234",
    }
    mock_candidate = Candidate(**mock_candidate_data)
    mock_get_by_email.return_value = mock_candidate

    candidate = Candidate.get_by_email("test@mail.com")

    assert candidate._id == "1234"
    assert candidate.email == "test@mail.com"
    assert candidate.password == "password"
    assert candidate.role == "candidate"
    assert candidate.first_name == "Test"
    assert candidate.last_name == "User"
    assert candidate.phone_number == "1234567890"
    assert candidate.description == "Test User Description"
    assert candidate.location == "Test Location"
    assert candidate.skills == ["python", "java"]
    assert candidate.previous_experience == "Test Experience"
    assert candidate.resume_id == "1234"

@patch('server.model.Candidate.delete')
def test_delete(mock_delete):
    mock_delete.return_value = "Deleted document with ID: 1234"
    result = Candidate.delete("1234")
    assert result == "Deleted document with ID: 1234"

@patch.object(Candidate, 'apply_to_job')
def test_apply_to_job(mock_apply_to_job):
    candidate = Candidate(
        _id="1234",
        email="test@mail.com",
        password="password",
        role="candidate",
        first_name="Test",
        last_name="User",
        phone_number="1234567890",
        description="Test User Description",
        location="Test Location",
        skills=["python", "java"],
        previous_experience="Test Experience",
        resume_id="1234",
    )

    mock_apply_to_job.return_value = True
    result = candidate.apply_to_job("2000")
    assert result == True
    mock_apply_to_job.assert_called_once_with("2000")

@patch('server.model.Candidate.get_applied_jobs')
def test_get_applied_jobs(mock_get_applied_jobs):
    mock_get_applied_jobs.return_value = [{"job_id": "2000"}, {"job_id": "3000"}]

    result = Candidate.get_applied_jobs("1234")

    assert result == [{"job_id": "2000"}, {"job_id": "3000"}]
    mock_get_applied_jobs.assert_called_once_with("1234")

@patch('server.model.Candidate.get_applications_by_candidate')
def test_get_applications_by_candidate(mock_get_applications_by_candidate):
    mock_get_applications_by_candidate.return_value = [{"_id": "1234", "candidate_id": "1000", "job_id": "2000", "status": "pending", "application_date": "2023-08-08"}]

    result = Candidate.get_applications_by_candidate("1234")

    assert result == [{"_id": "1234", "candidate_id": "1000", "job_id": "2000", "status": "pending", "application_date": "2023-08-08"}]
    mock_get_applications_by_candidate.assert_called_once_with("1234")

@patch('server.model.Candidate.get_application')
def test_get_application(mock_get_application):
    mock_get_application.return_value = {
        "_id": "1234", 
        "candidate_id": "1000", 
        "job_id": "2000", 
        "status": "pending", 
        "application_date": "2023-08-08"
    }

    result = Candidate.get_application("1234")

    assert result == {
        "_id": "1234", 
        "candidate_id": "1000", 
        "job_id": "2000", 
        "status": "pending", 
        "application_date": "2023-08-08"
    }
    mock_get_application.assert_called_once_with("1234")

@patch('server.model.Candidate.save_to_mongo')
def test_save_to_mongo(mock_save_to_mongo):
    candidate = Candidate(
        email="test@mail.com", 
        password="password", 
        role="candidate", 
        first_name="Test", 
        last_name="User", 
        phone_number="1234567890", 
        description="Test User Description", 
        location="Test Location", 
        skills=["python", "java"], 
        previous_experience="Test Experience", 
        resume_id="1234",
        _id="1234"
    )
    mock_save_to_mongo.return_value = candidate.json()

    result = candidate.save_to_mongo()

    assert result == candidate.json()
    mock_save_to_mongo.assert_called_once()
