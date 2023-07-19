from flask import Blueprint, request, jsonify 
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
        return jsonify(status=200, id=loguser._id, email=loguser.email, role=loguser.role) #'You have been logged in!'
    else:
        return jsonify(status=403, msg="invalid username/password")


@auth.route('/signup', methods=['POST'])
def signup():
    email = request.json['email']
    password = request.json['password']
    role = request.json['role']
    password = bcrypt.generate_password_hash(password).decode('utf-8')
    find_user =  User.get_by_email(email)
    if find_user is None:
        User.register(email, password, role)
        new_user = mongo.db.users.find_one({"email": email})
        return jsonify(status=201, id=new_user._id, email=new_user.email, role=new_user.role) # "signed up"
    else:
        return jsonify(status=403, msg=f"Account already exists for {email}!") # f"Account already exists for {email}!"
    

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify(status=200)