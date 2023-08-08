import pytest
from unittest.mock import patch
from server.model import Application

def test_application_init():
    application = Application(
        candidate_id="1000", 
        job_id="2000", 
        status="pending", 
        application_date="2023-08-08", 
        _id="1234"
    )
    
    assert application.candidate_id == "1000"
    assert application.job_id == "2000"
    assert application.status == "pending"
    assert application.application_date == "2023-08-08"
    assert application._id == "1234"

@patch('server.model.Application.get_by_id')
def test_get_by_id(mock_get_by_id):
    mock_application_data = {
        "_id": "1234",
        "candidate_id": "1000",
        "job_id": "2000",
        "status": "pending",
        "application_date": "2023-08-08"
    }
    mock_application = Application(**mock_application_data)
    mock_get_by_id.return_value = mock_application
    
    application = Application.get_by_id("1234")

    assert application._id == "1234"
    assert application.candidate_id == "1000"
    assert application.job_id == "2000"
    assert application.status == "pending"
    assert application.application_date == "2023-08-08"

@patch('server.model.Application.get_by_candidate_id')
def test_get_by_candidate_id(mock_get_by_candidate_id):
    mock_application_data = [{
        "_id": "1234",
        "candidate_id": "1000",
        "job_id": "2000",
        "status": "pending",
        "application_date": "2023-08-08"
    }]
    mock_application = [Application(**data) for data in mock_application_data]
    mock_get_by_candidate_id.return_value = mock_application

    applications = Application.get_by_candidate_id("1000")

    assert applications[0]._id == "1234"
    assert applications[0].candidate_id == "1000"
    assert applications[0].job_id == "2000"
    assert applications[0].status == "pending"
    assert applications[0].application_date == "2023-08-08"

@patch('server.model.Application.get_by_job_id')
def test_get_by_job_id(mock_get_by_job_id):
    mock_application_data = [{
        "_id": "1234",
        "candidate_id": "1000",
        "job_id": "2000",
        "status": "pending",
        "application_date": "2023-08-08"
    }]
    mock_application = [Application(**data) for data in mock_application_data]
    mock_get_by_job_id.return_value = mock_application

    applications = Application.get_by_job_id("2000")

    assert applications[0]._id == "1234"
    assert applications[0].candidate_id == "1000"
    assert applications[0].job_id == "2000"
    assert applications[0].status == "pending"
    assert applications[0].application_date == "2023-08-08"

@patch('server.model.Application.update_status')
def test_update_status(mock_update_status):
    mock_update_status.return_value = {"status": "accepted"}

    result = Application.update_status("1234", "accepted")

    assert result == {"status": "accepted"}

@patch('server.model.Application.delete')
def test_delete(mock_delete):
    mock_delete.return_value = "Deleted document with ID: 1234"
    result = Application.delete("1234")
    assert result == "Deleted document with ID: 1234"

@patch('server.model.Application.application_count')
def test_application_count(mock_application_count):
    mock_application_count.return_value = 2
    count = Application.application_count("2000")
    assert count == 2

def test_json():
    application = Application(
        candidate_id="1000", 
        job_id="2000", 
        status="pending", 
        application_date="2023-08-08", 
        _id="1234"
    )

    result = application.json()

    assert result == {
        "candidate_id": "1000",
        "job_id": "2000",
        "status": "pending",
        "application_date": "2023-08-08",
        "_id": "1234"
    }


@patch('server.model.Application.save_to_mongo')
def test_save_to_mongo(mock_save_to_mongo):
    application = Application(
        candidate_id="1000", 
        job_id="2000", 
        status="pending", 
        application_date="2023-08-08", 
        _id="1234"
    )
    mock_save_to_mongo.return_value = None

    application.save_to_mongo()

    mock_save_to_mongo.assert_called_once()
