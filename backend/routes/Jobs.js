const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Job = require("../models/job");


/* 
Use: add a new job
Request: all information about the job in body
    body: {
        title, _id, email, max_applications, max_positions,
        application_deadline_(year/month/day), skillsetlist,
        job_type, duration, salary
    }
*/
router.post("/addjob", (req, res) => {
  bodyelements = req.body;
  console.log(req.body);
  skillsetlist = bodyelements.skillsetlist;
    // TODO: get skillset ids 
  skillsetid = [];
  year = bodyelements.application_deadline_year;
  month = bodyelements.application_deadline_month;
  day = bodyelements.application_deadline_day;
  const newJob = new Job({
    title: bodyelements.title,
    recruiter: mongoose.Types.ObjectId(bodyelements._id),
    email: bodyelements.email,
    max_applications: bodyelements.max_applications,
    max_positions: bodyelements.max_positions,
    application_deadline: new Date(year, month, day),
    skillset: skillsetid,
    job_type: bodyelements.job_type,
    duration: bodyelements.duration,
    salary: bodyelements.salary,
  });
  newJob
    .save()
    .then((newJob) => {
      res.status(200).json({
        status: true,
        job: newJob,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

/* 
Use: get all active jobs
Request: none
*/
router.get("/activejobs", (req, res) => {
  Job.find({ active: true }, function (err, jobs) {
    if (err) {
      res.status(200).json({
        status: false,
        err: err,
      });
    } else {
      res.status(200).json({
        status: true,
        jobs: jobs,
      });
    }
  });
});

/* 
Use: update a job
Request: id and all the parameters to update
    body: {
        _id,
        [all fields to update]
    }
*/
router.put("/editjob", (req, res) => {
  var id = req.body._id;
  Job.findByIdAndUpdate(id, {"$set": req.body}, { new: true }, function (err, newjob) {
    if (err) {
      res.status(200).json({
        status: false,
        err: err,
      });
    } else {
      res.status(200).json({
        status: true,
        job: newjob,
      });
    }
  });
});

module.exports = router;
