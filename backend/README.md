# Backend

## Models

1. Language

   ```json
   {
      "id": _id,
      "name": str
   }
   ```

   

2. Job

   ```json
   {
      "id": _id,
      "title": str,
      "recruiter": _id,
      "email": str (regex email),
      "max_applications": int (>0),
      "max_positions": int (>0),
      "date_of_posting": date/time,
      "application_deadline": date/time,
      "skill_set": [_id of Language],
      "job_type": str (either full time, part time or wfh),
      "duration": int (>=0, <=6),
      "salary": int,
      "rating_sum": int,
      "rating_cnt": int,
      "recruited_people": int,
      "active": bool
   }
   ```

3. Applicant

   ```json
   {
      "id": _id,
      "first_name": str,
      "middle_name": str,
      "last_name": str,
      "email": str (regex email),
      "institute_name": str,
      "start_year": int,
      "end_year": int,
      "rating_sum": int,
      "rating_cnt": int,
      "resume": PDF  file (figure out how to),
      "photo": JPG file (figure out how to),
      "ratings": [_id of Rating],
      "accepted": bool
   }
   ```

4. Application

   ```json
   {
      "job": _id,
      "applicant": _id,
      "recruiter": _id,
      "sop": str,
      "title": str,
      "status": str (either applied, shortlisted, accepted or rejected),
      "still_eligible": bool
   }
   ```

5. Recruiter

   ```json
   {
      "id": _id,
      "first_name": str,
      "middle_name": str,
      "last_name": str,
      "email": str (regex email),
      "listings": [_id of Job],   
      "bio": str
   }
   ```

   

6. Employee

   ```json
   {
      "id": _id,
      "employee": _id of Applicant,
      "employer": _id of Recruiter,
      "date_of_joining": date/time,
      "job_type": str (either full time, part time or wfh),
      "job_title": str,
      "job": _id
   }
   ```

   

7. Rating

   ```json
   {
      "id": _id,
      "recruiter": bool,
      "person_giving_rating": _id,
      "person_getting_rating": _id,
      "rating": int (0-5)
   }
   ```

   

## API Endpoints

| Name            | Description                                                                           | Type     |
| --------------- | ------------------------------------------------------------------------------------- | -------- |
| addJob          | Job listing to be added by recruiter                                                  | POST     |
| addApplicant    | Add an applicant (new account)                                                        | POST     |
| addRecruiter    | Add a recruiter (new account)                                                         | POST     |
| addApplication  | Application for a job to be added by the applicant                                    | POST     |
| addRating       | Rating added by a recruiter or by an applicant                                        | POST     |
| addEmployee     | Employee to be added by recruiter                                                     | POST     |
| getJob          | All posted job listings for the applicants                                            | GET      |
| applyJob        | Apply for a job by the applicant                                                      | PUT/POST |
| listAppliedJobs | Get a list of all jobs that have been applied to by the applicant                     | GET      |
| rateRecruiter   | Rate the recruiter by the applicant on a scale of 0-5                                 | PUT/POST |
| getActiveJobs   | Get all active job listings for the recruiter                                         | GET      |
| editJob         | Option to edit jobs by the recruiter                                                  | PUT      |
| getApplications | Get all applications for a job for the recruiter                                      | GET      |
| changeJobStatus | Option to change the status of a job application by the recruiter for all active jobs | PUT      |
| getEmployees    | Get all employess for the recruiter                                                   | GET      |
| rateEmployee    | Rate the employee by the recruiter on a scale of 0-5                                  |          |

