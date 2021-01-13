var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const User = require("../models/user");

router.get("/checkuser", (req, res) => {
  const email = req.headers.email;
  User.count({ email: email }, function (err, count) {
    if (count > 0) {
      res.status(200).json({
        status: true,
        exists: true,
      });
    } else {
      res.status(200).json({
        status: true,
        exists: false,
      });
    }
  });
});

router.post("/newuser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const objID = mongoose.Types.ObjectId(req.body.objId);
  const type = req.body.type;
  const newUser = new User({
    email: email,
    password: password,
    collectionid: objID,
    collectionname: type,
  });
  newUser
    .save()
    .then((newUser) => {
      res.status(200).json({
        status: true,
        user: newUser,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        err: err,
      });
    });
});

router.get("/checklogin", (req, res) => {
  const email = req.headers.email;
  const password = req.headers.password;
  const checker = { email: email, password: password };
  User.findOne(checker)
    .then((user) => {
      if (user) {
        res.status(200).json({
          status: true,
          found: true,
          user: user,
        });
      } else {
        res.status(200).json({
          status: true,
          found: false,
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

module.exports = router;
