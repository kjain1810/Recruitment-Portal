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

router.get("/myapplicants", (req, res) => {
  var ids = req.headers.ids.split(",");
  Applicant.find({"_id": {$in: ids}}, function(err, applicants) {
    if(err) {
      res.status(200).json({
        status: false,
        err: err
      });
    } else {
      res.status(200).json({
        status: true,
        applications: applicants
      });
    }
  })
})

router.put("/getrating", (req, res) => {
  Applicant.findByIdAndUpdate(req.body.id, {$inc: req.body.inc}).then(app => {
    if(app) {
      res.status(200).json({
        status: true,
        found: true,
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
  })
})

router.post("/uploadphoto", (req, res) => {
  if(req.files === null) {
    res.status(200).json({
      status: false,
      err: "No file"
    });
  } else {
    const file = req.files.file;
    file.mv(__dirname + '/../../frontend/public/uploads/photos/' + req.body.email + '.jpg', err => {
      if(err) {
        res.status(200).json({
          status: false,
          err: err
        });
      res.status(200).json({
        status: true
      })
      }
    })
  }
})

router.post("/uploadcv", (req, res) => {
  if(req.files === null) {
    res.status({
      status: false,
      err: "No file"
    });
  } else {
    const file = req.files.file;
    file.mv(__dirname + "/../../frontend/public/uploads/cv/" + req.body.email + ".pdf", err => {
      if(err) {
        res.status(200).json({
          status: false,
          err: err
        });
      }
    })    
  }
})

module.exports = router;
