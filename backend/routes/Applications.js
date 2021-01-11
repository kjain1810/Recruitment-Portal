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
  Application.find({ applicant: req.body.applicantid })
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

module.exports = router;
