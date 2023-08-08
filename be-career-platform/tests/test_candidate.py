import json
from unittest.mock import patch
from server.model import Candidate, Resume, Application

def test_index(app, init_database, logged_in_client):
    res = logged_in_client.get('/candidate/index')
    assert res.status_code == 200
    assert "in candidate index" in res.get_data(as_text=True)

@patch('server.model.Candidate.get_by_id')
def test_get_profile(mock_get_by_id, app, client):
    mock_get_by_id.return_value = Candidate(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    
    res = client.get('/candidate/profile/1234')
    assert res.status_code == 200
    assert "test@mail.com" in res.get_data(as_text=True)

@patch('server.model.Candidate.save_to_mongo')
def test_create_profile(mock_save_to_mongo, app, client):
    mock_save_to_mongo.return_value = None
    data = {
        "email": "test@mail.com",
        "password": "test1234",
        "role": "candidate",
        "_id": "1234"
    }
    
    res = client.post('/candidate/profile', data=json.dumps(data), content_type='application/json')
    assert res.status_code == 201
    assert "test@mail.com" in res.get_data(as_text=True)

def test_update_profile(app, logged_in_client):
    # Create a Candidate object and save it to your test database
    candidate = Candidate(email="test@mail.com", password="test1234", role="candidate")
    candidate.save_to_mongo()  # Save the candidate to generate an ID

    with patch('server.model.Candidate.get_by_id') as mock_get_by_id, \
            patch('server.extensions.mongo.db.candidate.find_one_and_update') as mock_find_one_and_update:

        # Mock the get_by_id method to return the candidate you created
        mock_get_by_id.return_value = candidate

        # Define the updated document
        updated_document = {
            "_id": candidate._id,
            "email": "updated@mail.com",
            "password": "test1234",
            "role": "candidate",
        }

        # Mock the find_one_and_update method to return the updated document
        mock_find_one_and_update.return_value = updated_document

        # Define the data to send in the request
        updated_data = {
            "email": "updated@mail.com",
            "password": "test1234",
            "role": "candidate",
            "_id": candidate._id  # Use the ID of the candidate you created
        }

        # Send the POST request
        res = logged_in_client.post(f'/candidate/profile/{candidate._id}', data=json.dumps(updated_data), content_type='application/json')

        # Assert the status code and response data
        assert res.status_code == 200
        assert "updated@mail.com" in res.get_data(as_text=True)


@patch('server.model.Candidate.get_by_id')
@patch('server.model.Candidate.apply_to_job')
def test_apply(mock_apply_to_job, mock_get_by_id, app, client):
    candidate = Candidate(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    mock_get_by_id.return_value = candidate
    mock_apply_to_job.return_value = True

    res = client.post('/candidate/1234/apply/5678')
    assert res.status_code == 200
    assert "You have successfully applied to the job." in res.get_data(as_text=True)

@patch('server.model.Candidate.get_by_id')
@patch('server.model.JobPosting.get_jobListsBYEmployerId')
def test_get_jobs_by_employer(mock_get_jobListsBYEmployerId, mock_get_by_id, app, client):
    candidate = Candidate(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    mock_get_by_id.return_value = candidate
    mock_get_jobListsBYEmployerId.return_value = [{"job_id": "5678", "employer_id": "1234"}]

    res = client.get('/candidate/1234/employer/5678')
    assert res.status_code == 200
    assert "5678" in res.get_data(as_text=True)

@patch('server.model.Candidate.get_by_id')
@patch('server.model.Candidate.get_applied_jobs')
def test_get_applied_jobs(mock_get_applied_jobs, mock_get_by_id, app, client):
    candidate = Candidate(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    mock_get_by_id.return_value = candidate
    mock_get_applied_jobs.return_value = [{"job_id": "5678", "employer_id": "1234"}]

    res = client.get('/candidate/1234/jobs')
    assert res.status_code == 200
    assert "5678" in res.get_data(as_text=True)

@patch('server.model.Candidate.get_by_id')
@patch('server.model.Resume.save_to_mongo')
def test_create_resume(mock_save_to_mongo, mock_get_by_id, app, client):
    candidate = Candidate(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    mock_get_by_id.return_value = candidate
    mock_save_to_mongo.return_value = None

    resume_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@mail.com",
        "phone": "1234567890",
        "education": [{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}],
        "skills": ["python", "java"],
        "experience": [{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}],
        "file": {"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"},
        "_id": "1234",
        "candidate_id": "1000"
    }

    res = client.post('/candidate/1234/resume', data=json.dumps(resume_data), content_type='application/json')
    assert res.status_code == 201
    assert "test@mail.com" in res.get_data(as_text=True)

@patch('server.model.Resume.get_by_candidate_id')
def test_get_resume(mock_get_by_candidate_id, app, client):
    resume = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@mail.com",
        "phone": "1234567890",
        "education": [{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}],
        "skills": ["python", "java"],
        "experience": [{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}],
        "file": {"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"},
        "_id": "1234",
        "candidate_id": "1000"
    }
    mock_get_by_candidate_id.return_value = resume

    res = client.get('/candidate/1234/resume')
    assert res.status_code == 200
    assert "test@mail.com" in res.get_data(as_text=True)

@patch('server.model.Resume.get_by_id')
def test_get_resume_by_id(mock_get_by_id, app, client):
    resume = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@mail.com",
        "phone": "1234567890",
        "education": [{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}],
        "skills": ["python", "java"],
        "experience": [{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}],
        "file": {"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"},
        "_id": "1234",
        "candidate_id": "1000"
    }
    mock_get_by_id.return_value = resume

    res = client.get('/candidate/resume/1234')
    assert res.status_code == 200
    assert "test@mail.com" in res.get_data(as_text=True)

@patch('server.model.Candidate.get_applications_by_candidate')
def test_get_candidate_applications(mock_get_applications_by_candidate, app, client):
    applications = [
        {"_id": "1234", "candidate_id": "1000", "job_id": "5678", "status": "pending", "application_date": "2023-01-01"},
        {"_id": "2345", "candidate_id": "1000", "job_id": "6789", "status": "accepted", "application_date": "2023-01-02"}
    ]
    mock_get_applications_by_candidate.return_value = applications

    res = client.get('/candidate/1000/applications')
    assert res.status_code == 200
    assert "5678" in res.get_data(as_text=True)
    assert "6789" in res.get_data(as_text=True)

@patch('server.model.Candidate.get_application')
def test_get_candidate_application(mock_get_application, app, client):
    application = {"_id": "1234", "candidate_id": "1000", "job_id": "5678", "status": "pending", "application_date": "2023-01-01"}
    mock_get_application.return_value = application

    res = client.get('/candidate/applications/1234')
    assert res.status_code == 200
    assert "5678" in res.get_data(as_text=True)

@patch('server.model.Application.delete')
def test_delete_candidate_application(mock_delete, app, client):
    mock_delete.return_value = "Deleted document with ID: 1234"

    res = client.delete('/candidate/applications/1234')
    assert res.status_code == 200
    assert "Deleted document with ID: 1234" in res.get_data(as_text=True)

@patch('server.model.Candidate.delete')
def test_delete_candidate(mock_delete, app, client):
    mock_delete.return_value = "Deleted document with ID: 1234"

    res = client.delete('/candidate/1234')
    assert res.status_code == 200
    assert "Deleted document with ID: 1234" in res.get_data(as_text=True)
