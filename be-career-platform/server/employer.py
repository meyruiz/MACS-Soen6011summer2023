from flask import Blueprint
from flask_login import login_required, current_user
from .model import User

employer = Blueprint('employer', __name__)

def notEmployerRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role != "employer":
        return True
    return False 

@employer.route('/employer/index')
@login_required
def index():
    if notEmployerRole():
        return "You are not an employer."
    return "in employer index"

@employer.route('/employer/profile')
@login_required
def profile():
    if notEmployerRole():
        return "You are not an employer."
    return "in employer profile"