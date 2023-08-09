import pytest

from unittest.mock import patch, MagicMock
from server import User

@pytest.fixture()
def user():
    return User("test@mail.com", "password", "candidate", "1000")
                
def test_new_user(user: User):
    assert user.email == "test@mail.com"
    assert user.password == "password"
    assert user.role == "candidate"
    assert user._id == "1000"

@patch('server.model.User.get_by_id')
def test_get_by_id(mock_get_by_id):
    mock_user_data = {
        "_id": "1234",
        "email": "test1@mail.com",
        "password": "password1",
        "role": "candidate",
    }
    mock_user = User(**mock_user_data)
    mock_get_by_id.return_value = mock_user
    user = User.get_by_id("1234")
    assert user._id == "1234"
    assert user.email == "test1@mail.com"
    assert user.password == "password1"
    assert user.role == "candidate"

@patch('server.model.User.get_by_email')
def test_get_by_email(mock_get_by_email):
    mock_user_data = {
        "_id": "1234",
        "email": "test2@mail.com",
        "password": "password2",
        "role": "candidate",
    }
    mock_user = User(**mock_user_data)
    mock_get_by_email.return_value = mock_user
    user = User.get_by_email("test2@mail.com")
    assert user._id == "1234"
    assert user.email == "test2@mail.com"
    assert user.password == "password2"
    assert user.role == "candidate"