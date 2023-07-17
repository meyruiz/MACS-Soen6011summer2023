from flask import Blueprint
from flask_login import login_required, current_user
from .model import User

candidate = Blueprint('candidate', __name__)

def notCandidateRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role != "candidate":
        return True
    return False 

@candidate.route('/candidate/index', methods=['GET'])
@login_required
def index():
    if notCandidateRole():
        return "You are not a candidate."
    return "in candidate index"

@candidate.route('/candidate/profile', methods=['GET'])
@login_required
def profile():
    if notCandidateRole():
        return "You are not a candidate."
    return "in candidate profile"