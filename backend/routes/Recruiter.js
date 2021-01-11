var express = require("express");
var router = express.Router();

const Recruiter = require("../models/recruiter");

router.post("/addrecruiter", (req, res) => {
  bodyelements = req.body;
  console.log(bodyelements);
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

module.exports = router;
