import json
from unittest.mock import patch
from server.model import User

@patch('server.model.User.login_valid')
@patch('server.extensions.mongo.db')
def test_login(mock_db, mock_login_valid, client):
    data = {
        "email": "test1@mail.com",
        "password": "test1234",
    }
    mock_db.users.find_one.return_value = {
        "email": "test1@mail.com", 
        "password": "test1234", 
        "role": "candidate", 
        "_id": "1234"
    }
    mock_login_valid.return_value = True
    res = client.post('/login', data=json.dumps(data), content_type='application/json')
    assert res.status_code == 200
    assert "test1@mail.com" in res.get_data(as_text=True)

@patch('server.model.User.register')
@patch('server.extensions.mongo.db')
def test_signup(mock_db, mock_register, client):
    data = {
        "email": "test2@mail.com",
        "password": "test1234",
        "role": "candidate",
    }
    mock_db.users.find_one.return_value = {
        "email": "test2@mail.com", 
        "password": "test1234", 
        "role": "candidate", 
        "_id": "1235"
    }
    mock_register.return_value = True
    res = client.post('/signup', data=json.dumps(data), content_type='application/json')
    assert res.status_code == 200
    assert "test2@mail.com" in res.get_data(as_text=True)

@patch('flask_login.logout_user')
def test_logout(mock_logout_user, client):
    mock_logout_user.return_value = True
    res = client.post('/logout')
    assert res.status_code == 200