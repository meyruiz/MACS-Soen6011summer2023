import pytest

from server import User

@pytest.fixture()
def user():
    return User("test@mail.com", "password", "candidate", "1000")
                
def test_new_user(user: User):
    assert user.email == "test@mail.com"
    assert user.password == "password"
    assert user.role == "candidate"
    assert user._id == "1000"