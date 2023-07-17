from flask import Blueprint
from flask_login import login_required, current_user

employer = Blueprint('employer', __name__)

def checkEmployerRole():
    if current_user.role != "employer":
        return "You are not an employer."

@employer.route('/employer/index')
@login_required
def index():
    checkEmployerRole()
    return "in employer index"

@employer.route('/employer/profile')
@login_required
def profile():
    checkEmployerRole()
    return "in employer profile"