from flask import Blueprint, request, flash
from .extensions import mongo, bcrypt
from flask_login import logout_user, login_required, login_user
from .model import User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    email = request.json["email"]
    password = request.json["password"]
    find_user = mongo.db.users.find_one({"email": email})
    if User.login_valid(email, password):
        loguser = User(find_user["email"], find_user["password"], find_user["role"], find_user["_id"])
        login_user(loguser)
        flash('You have been logged in!', 'success')
        return 'You have been logged in!'
    else:
        flash('Login Unsuccessful. Please check email and password', 'danger')
        return "invalid username/password"


@auth.route('/signup', methods=['POST'])
def signup():
    email = request.json['email']
    password = request.json['password']
    role = request.json['role']
    password = bcrypt.generate_password_hash(password).decode('utf-8')
    find_user =  User.get_by_email(email)
    if find_user is None:
        User.register(email, password, role)
        flash(f'Account created for {email}!', 'success')
        return "signed up"
    else:
        flash(f'Account already exists for {email}!', 'success')
        return f"Account already exists for {email}!"
    

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return 'Logged out'