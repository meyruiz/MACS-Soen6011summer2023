import pytest
import unittest
from unittest.mock import patch,MagicMock  
from server.model import JobPosting,User
from datetime import datetime
import json


#Test Employer Endpoint
class MockCollection:
    def insert_one(self, record):

        if( record["jobTitle"]=="Manager"):
            return { "_id": "jobidnew",
            "employerId":"employer1",
            "jobTitle":"Manager",
            "companyName":"companyName",
            "jobDescription":"description",
             "skillSets":["skill1","skill2"]
            }
        else:
            return None

    def find_one(self, query):
        if query["_id"] == "jobidnew":
            return    { "_id": "jobidnew",
            "employerId":"employer1",
            "jobTitle":"Manager",
            "companyName":"companyName",
            "jobDescription":"description",
             "skillSets":["skill1","skill2"]
            }
        return None
    
    def find(self,query):
        if(query["employerId"] == employer1):
            return [{"_id": "jobid1",  "employerId":"employer1","jobTitle": "Library Manager1"}, { "_id": "jobidnew",
                "employerId":"employer1",
                "jobTitle":"Manager",
                }]
        return None

    def update_one(self, filter, update):
        return MagicMock(modified_count=1)

    def find_one_and_delete(self, query):
        if query["_id"] == "jobid1":
            return {"_id": "jobid1", "jobTitle": "Library Manager"}
        return None


mockdb = MagicMock()
mockdb.jobs = MockCollection()


@patch('server.extensions.mongo.db',mockdb)
def test_postJob(client):
    data = { 
            "jobTitle":"Manager",
            "companyName":"companyName",
            "jobDescription":"description",
             "skillSets":["skill1","skill2"]
            }
    res = client.post('/employer/post/employer1', data=json.dumps(data), content_type='application/json')
    assert res.status_code == 201
    assert "jobId" in res.get_data(as_text=True)

@patch('server.extensions.mongo.db',mockdb)
def test_getJobByJobId(client):
    res = client.get('/employer/employer1/jobidnew')
    assert res.status_code == 200
    assert "employer1" in res.get_data(as_text=True)
    assert "jobidnew" in res.get_data(as_text=True)

