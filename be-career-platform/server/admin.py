import json
from .extensions import mongo
from flask import Blueprint, jsonify, request, abort
from flask_login import login_required, current_user
from .model import JobPosting, Resume, User, Candidate
from pymongo import ReturnDocument
from bson.objectid import ObjectId
from bson.json_util import dumps
from urllib.parse import parse_qs

admin = Blueprint('admin', __name__)

def notAdminRole():
    find_user =  User.get_by_id(current_user.get_id())
    if find_user.role.lower() != "admin":
        return True
    return False

@admin.route('/admin/index', methods=['GET'])
@login_required
def index():
    if notAdminRole():
        return "You are not an admin."
    return "in admin index"

@admin.route('/admin/candidates', methods=['GET'])
def findAllCandidates():
    # if notAdminRole():
        # return jsonify(status=403, msg="You are not an admin.")
    data = Candidate.get_all()
    candidates = []
    for x in data:
        candidates.append({
            "_id": x._id,
        "email": x.email,
        "role": x.role,
        "first_name": x.first_name,
        "last_name": x.last_name,
        "phone_number": x.phone_number,
        "description": x.description,
        "location": x.location,
        "skills": x.skills,
        "previous_experience": x.previous_experience,
        })
    return jsonify(status=200, result=candidates)

@admin.route('/admin/users',methods = ['GET'])
def queryAllUsers():
    try:
        query_string = request.query_string
        parsed_query = parse_qs(query_string)
        filter_query = {}
        for param, values in parsed_query.items():
            param = param.decode("utf-8")
            if len(values) == 1:
                value = values[0].decode("utf-8")
                filter_query[param] = value
            else:
                values_str = [value.decode("utf-8") for value in values]
                filter_query[param] = {"$all": values_str}
        users = mongo.db.users.find(filter_query)
        response = []
        for user in users:
            user.pop('password',None)
            response.append(user)
        return jsonify(response) , 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
