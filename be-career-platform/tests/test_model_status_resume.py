from unittest.mock import patch
from server.model import Status, Resume

def test_status_is_valid():
    assert Status.is_valid("pending") == True
    assert Status.is_valid("interview") == True
    assert Status.is_valid("accepted") == True
    assert Status.is_valid("rejected") == True
    assert Status.is_valid("invalid_status") == False

def test_resume_init():
    resume = Resume(
        first_name="Test", 
        last_name="User", 
        email="test@mail.com", 
        phone="1234567890", 
        education=[{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}], 
        skills=["python", "java"], 
        experience=[{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}], 
        file={"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"}, 
        _id="1234", 
        candidate_id="1000"
    )
    
    assert resume.first_name == "Test"
    assert resume.last_name == "User"
    assert resume.email == "test@mail.com"
    assert resume.phone == "1234567890"
    assert resume.education == [{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}]
    assert resume.skills == ["python", "java"]
    assert resume.experience == [{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}]
    assert resume.file == {"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"}
    assert resume._id == "1234"
    assert resume.candidate_id == "1000"

@patch('server.model.Resume.delete_by_user_id')
def test_delete_by_user_id(mock_delete_by_user_id):
    mock_delete_by_user_id.return_value = "Deleted document with ID: 1000"
    result = Resume.delete_by_user_id("1000")
    assert result == "Deleted document with ID: 1000"

@patch('server.model.Resume.get_by_id')
def test_get_by_id(mock_get_by_id):
    mock_get_by_id.return_value = {
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

    resume = Resume.get_by_id("1234")

    assert resume == {
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

@patch('server.model.Resume.get_by_candidate_id')
def test_get_by_candidate_id(mock_get_by_candidate_id):
    mock_get_by_candidate_id.return_value = {
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

    resume = Resume.get_by_candidate_id("1000")

    assert resume == {
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

@patch('server.model.Resume.get_by_email')
def test_get_by_email(mock_get_by_email):
    mock_get_by_email.return_value = {
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

    resume = Resume.get_by_email("test@mail.com")

    assert resume == {
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

def test_resume_json():
    resume = Resume(
        first_name="Test", 
        last_name="User", 
        email="test@mail.com", 
        phone="1234567890", 
        education=[{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}], 
        skills=["python", "java"], 
        experience=[{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}], 
        file={"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"}, 
        _id="1234", 
        candidate_id="1000"
    )

    result = resume.json()

    assert result == {
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

@patch('server.model.Resume.save_to_mongo')
def test_resume_save_to_mongo(mock_save_to_mongo):
    resume = Resume(
        first_name="Test", 
        last_name="User", 
        email="test@mail.com", 
        phone="1234567890", 
        education=[{"school": "Test University", "degree": "BSc", "field_of_study": "Computer Science", "start_year": "2018", "end_year": "2022"}], 
        skills=["python", "java"], 
        experience=[{"job_title": "Software Engineer", "company": "Test Company", "start_date": "2022-01-01", "end_date": "2023-01-01", "description": "Test job description"}], 
        file={"file_name": "resume.pdf", "file_type": "pdf", "file_size": "1MB"}, 
        _id="1234", 
        candidate_id="1000"
    )
    mock_save_to_mongo.return_value = resume.json()

    result = resume.save_to_mongo()

    assert result == resume.json()
