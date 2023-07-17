from flask import Blueprint
from flask_login import login_required, current_user
from .model import User

candidate = Blueprint('candidate', __name__)

def checkCandidateRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role != "candidate":
        return "You are not a candidate."

@candidate.route('/candidate/index', methods=['GET'])
@login_required
def index():
    # checkCandidateRole()
    return "in candidate index"

@candidate.route('/candidate/profile', methods=['GET'])
@login_required
def profile():
    # checkCandidateRole()
    return "in candidate profile"