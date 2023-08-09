import pytest
import unittest
from unittest.mock import patch,MagicMock  
from server.model import JobPosting
from datetime import datetime



class MockCollection:

    def find_one(self, query):
        if query["_id"] == "jobid1":
            return    { "_id": "jobid1",
            "employerId":"employer1",
            "jobTitle":"Library Manager",
            }
        return None
    
    def find(self):
        
        return [{"_id": "jobid1", "jobTitle": "Library Manager1"}, {"_id": "jobid2", "jobTitle": "Job 2"}]

    def update_one(self, filter, update):
        return MagicMock(modified_count=1)

    def find_one_and_delete(self, query):
        if query["_id"] == "jobid1":
            return {"_id": "jobid1", "jobTitle": "Library Manager"}
        return None


mockdb = MagicMock()
mockdb.jobs = MockCollection()


@patch('server.extensions.mongo.db',mockdb)
class TestJobPosting(unittest.TestCase):

    @patch('uuid.uuid4', side_effect=lambda: MagicMock(hex="mocked_id"))
    def setUp(self,*kwargs):
        self.test_init
        self.job =  JobPosting(
            "employerId", "Library Manager","This role of this job is to manage library",
            "National Libarary", ["Microsoft Office","French"]
        )
        print(self.job._id)

    @patch('uuid.uuid4', side_effect=lambda: MagicMock(hex="mocked_id"))
    def test_init(self,*kwargs):
        # self.assert(job.emoloyerId, "employerId")
        assert self.job.employerId == "employerId"
        assert self.job._id == "mocked_id"
        assert self.job.jobTitle == "Library Manager"
        assert self.job.jobDescription == "This role of this job is to manage library"
        assert self.job.companyName == "National Libarary"
        assert self.job.skillSets ==["Microsoft Office","French"]
    
    @patch('uuid.uuid4', side_effect=lambda: MagicMock(hex="mocked_id"))
    def test_get_id(self,*kwargs):
        assert self.job.get_jobId() == "mocked_id"

    def test_get_jobBYJobId_found(self):
        result = JobPosting.get_jobBYJobId("jobid1")
        print("result:")
        print(result)
        self.assertIsNotNone(result)
        self.assertEqual(result["_id"], "jobid1")

    def test_get_jobBYJobId_not_found(self):
        result = JobPosting.get_jobBYJobId("non_existent_id")
        self.assertIsNone(result)

    def test_get_allJobs(self):
        result = JobPosting.get_allJobs()
        self.assertIsNotNone(result)
        self.assertEqual(len(list(result)), 2)

    def test_put(self):
        update_info = {"jobTitle": "Updated Job Title"}
        result = JobPosting.put("jobid1", update_info)
        self.assertIsNotNone(result)
        self.assertEqual(result.modified_count, 1)

    def test_delete_found(self):
        result = JobPosting.delete("jobid1")
        self.assertEqual(result, "Deleted document with ID: jobid1")

    def test_delete_not_found(self):
        with self.assertRaises(Exception) as context:
            JobPosting.delete("non_existent_id")
        self.assertEqual(str(context.exception), "No job found with jobID: non_existent_id")
