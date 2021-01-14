var express = require("express");
var router = express.Router();

const Applicant = require("../models/applicant");

router.post("/addapplicant", (req, res) => {
  bodyelements = req.body;
  console.log(bodyelements);
  const newApplicant = new Applicant(bodyelements);
  newApplicant
    .save()
    .then((newApplicant) => {
      res.status(200).json({
        status: true,
        applicant: newApplicant,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

router.get("/getapplicant", (req, res) => {
  const id = req.headers.id;
  Applicant.findById(id)
    .then((applicant) => {
      if (applicant === undefined) {
        res.status(200).json({
          status: true,
          found: false,
        });
      } else {
        res.status(200).json({
          status: true,
          found: true,
          applicant: applicant,
        });
      }
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

router.put("/editapplicant", (req, res) => {
  var id = req.body.id;
  Applicant.findByIdAndUpdate(id, {"$set": req.body}, { new: true }, function (
    err,
    newApplicant
  ) {
    if (err) {
      res.status(200).json({
        status: false,
        err: err,
      });
    } else if (newApplicant === undefined) {
      res.status(200).json({
        status: true,
        updated: false,
      });
    } else {
      res.status(200).json({
        status: true,
        updated: true,
        newApplicant: newApplicant,
      });
    }
  });
});

module.exports = router;
