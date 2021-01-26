var express = require("express");
var router = express.Router();

const Application = require("../models/application");

router.post("/addapplication", (req, res) => {
  bodyelements = req.body;
  console.log(bodyelements);
  const newApplication = new Application(bodyelements);
  newApplication
    .save()
    .then((newApplication) => {
      res.status(200).json({
        status: true,
        recruiter: newApplication,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

router.get("/myapplications", (req, res) => {
  Application.find({ applicant: req.headers.applicantid })
    .then((applications) => {
      res.status(200).json({
        status: true,
        applications: applications,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

router.get("/getapplications", (req, res) => {
  Application.count({ job: req.headers.id }, function (err, count) {
    if (err) {
      res.status(200).json({
        status: false,
        err: err,
      });
    } else {
      res.status(200).json({
        status: true,
        count: count,
      });
    }
  });
});

router.get("/jobapplications", (req, res) => {
  Application.find({job: req.headers.id}).then((applications) => {
    console.log(req.headers.id, applications);
    res.status(200).json({
      status: true,
      applications: applications
    });
  }).catch((err) => {
    res.status(200).json({
      status: false,
      err: err
    });
  });
})

router.put("/changestatus", (req, res) => {
  Application.findByIdAndUpdate(req.body.id, {$set: {status: req.body.status}}, {new: true}, function(err, app) {
    if(err) {
      res.status(200).json({
        status: false,
        err: err
      });
    } else if (app) {
      res.status(200).json({
        status: true,
        found: true,
        application: app
      });
    } else {
      res.status(200).json({
        status: true,
        found: false
      });
    }
  })
})

router.put("/markineligible", (req, res) => {
  Application.updateMany({applicant: req.body.id}, {$set: {still_eligible: false}}).then(apps => {
    res.status(200).json({
      status: true
    });
  }).catch(err => {
    res.status(200).json({
      status: false,
      err: err
    });
  });
})

router.delete("/removeapplications", (req, res) => {
  Application.deleteMany({job: req.headers.id}).then(app => {
    res.status(200).json({
      status: true
    });
  }).catch(err => {
    res.status(200).json({
      status: false,
      err: err
    });
  });
})


module.exports = router;
