import json
from unittest.mock import patch, MagicMock
from server.model import Candidate, User, Resume

@patch('server.model.User.get_by_id')
def test_index(mock_get_by_id, app, client):
    # Create a mock user
    mock_user = User(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    
    # When get_by_id is called, return the mock user
    mock_get_by_id.return_value = mock_user

    res = client.get('/candidate/index')
    assert res.status_code == 200
    assert "in candidate index" in res.get_data(as_text=True)

@patch('server.model.Candidate.get_by_id')
def test_get_profile(mock_get_by_id, app, client):
    mock_get_by_id.return_value = Candidate(email="test@mail.com", password="test1234", role="candidate", _id="1234")
    
    res = client.get('/candidate/profile/1234')
    assert res.status_code == 200
    assert "test@mail.com" in res.get_data(as_text=True)

@patch('server.model.Candidate.save_to_mongo')
def test_create_profile(mock_save_to_mongo, client):
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

@patch('server.model.Candidate.get_by_id')
@patch('server.model.Candidate.save_to_mongo')
@patch('server.extensions.mongo.db')
def test_update_profile(mock_db, mock_save_to_mongo, mock_get_by_id, client):
    # Create a Candidate object
    candidate = Candidate(email="test@mail.com", password="test1234", role="candidate")
    mock_save_to_mongo.return_value = None
    mock_get_by_id.return_value = candidate

    # Define the updated document
    updated_document = {
        "_id": candidate._id,
        "email": "updated@mail.com",
        "password": "test1234",
        "role": "candidate",
    }

    # Mock the find_one_and_update method of the 'candidate' collection
    mock_db.candidate.find_one_and_update.return_value = updated_document

    # Define the data to send in the request
    updated_data = {
        "email": "updated@mail.com",
        "password": "test1234",
        "role": "candidate",
        "_id": candidate._id  # Use the ID of the candidate you created
    }

    # Send the POST request
    res = client.post(f'/candidate/profile/{candidate._id}', data=json.dumps(updated_data), content_type='application/json')

    # Assert the status code and response data
    assert res.status_code == 200
    assert "updated@mail.com" in res.get_data(as_text=True)

@patch.object(Candidate, 'get_by_id')
@patch.object(Resume, 'save_to_mongo')
@patch('server.extensions.mongo.db')
@patch('uuid.uuid4')
def test_create_resume(mock_uuid4, mock_db, mock_save_to_mongo, mock_get_by_id, client):
    mock_uuid4.return_value.hex = "1234"
    # Create a mock instance of Candidate
    candidate_mock = MagicMock()

    # Set the return value of the json() method to the desired dictionary
    candidate_mock.json.return_value = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@mail.com"\
    }

    # Set the return value of the get_by_id method to the mock instance
    mock_get_by_id.return_value = candidate_mock

    # Define the resume data
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

    # Mocking methods and return values
    mock_save_to_mongo.return_value = None
    mock_db.resumes.find_one_and_update.return_value = resume_data

    # Send the POST request
    res = client.post('/candidate/1000/resume', data=json.dumps(resume_data), content_type='application/json')

    # Assert the status code
    assert res.status_code == 201

    # Get the response data
    response_data = json.loads(res.get_data(as_text=True))

    # Assert the response data
    assert response_data["_id"] == "1234"
    assert response_data["email"] == "test@mail.com"
    assert response_data["first_name"] == "Test"
    assert response_data["last_name"] == "User"
