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

module.exports = router;
