import os
import pytest
from server import create_app
from server.model import User
from server.extensions import mongo, bcrypt
from dotenv import load_dotenv

# # Load the environment variables from the .env file
load_dotenv()

@pytest.fixture
def app():
    extra_config = {
        'TESTING': True,
        'MONGO_URI': os.getenv('MONGO_URI'),
        'SECRET_KEY': os.getenv('SECRET_KEY')
    }
    app = create_app(extra_config=extra_config)
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

# @pytest.fixture
# def init_database():

#     password = "testuser"
#     password = bcrypt.generate_password_hash(password).decode('utf-8')
#     # Create a mock user
#     dummy_id = "1234"
#     mock_user = User(
#         _id=dummy_id,
#         email="testuser@example.com",
#         password=password,
#         role="candidate"
#     )

#     mock_user.save_to_mongo()

#     yield
#     mongo.db.users.find_one_and_delete({"_id": dummy_id})

# @pytest.fixture
# def logged_in_client(client):
#     with client:
#         # Log in the user
#         response = client.post('/login', json={
#             'email': 'testuser@example.com',
#             'password': 'testuser'
#         })

#         return client
