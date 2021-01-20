var express = require("express");
var router = express.Router();

const Recruiter = require("../models/recruiter");

router.post("/addrecruiter", (req, res) => {
  bodyelements = req.body;
  const newRecruiter = new Recruiter(bodyelements);
  newRecruiter
    .save()
    .then((newRecruiter) => {
      res.status(200).json({
        status: true,
        recruiter: newRecruiter,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

router.get("/getrecruiter", (req, res) => {
  const id = req.headers.id;
  Recruiter.findById(id).then((recruiter) => {
    if(recruiter === undefined) {
      res.status(200).json({
        status: true,
        found: false
      });
    } else {
      res.status(200).json({
        status: true,
        found: true,
        recruiter: recruiter
      });
    }
  }).catch((err) => {
    res.status(200).json({
      status: false,
      err: err
    });
  });
})

router.put("/updaterecruiter", (req, res) => {
  const id = req.body.id;
  Recruiter.findByIdAndUpdate(id, {"$set": req.body}, { new: true }, function (
    err,
    newRecruiter
  ) {
    if (err) {
      res.status(200).json({
        status: false,
        err: err,
      });
    } else if (newRecruiter === undefined) {
      res.status(200).json({
        status: true,
        found: false,
      });
    } else {
      res.status(200).json({
        status: true,
        found: true,
        recruiter: newRecruiter,
      });
    }
  });
})

router.put("/getrating", (req, res) => {
  Recruiter.findByIdAndUpdate(req.body.id, {$inc: req.body.inc}).then(rec => {
    if(rec) {
      res.status(200).json({
        status: true,
        found: true
      });
    } else {
      res.status(200).json({
        status: true,
        found: false
      });
    }
  }).catch(err => {
    res.status(200).json({
      status: false,
      err: err
    });
  });
})

module.exports = router;
