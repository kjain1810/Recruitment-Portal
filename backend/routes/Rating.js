var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Rating = require("../models/rating");

router.get("/getrating", (req, res) => {
    console.log(req.headers);
    const finder = {
        person_getting_rating: mongoose.Types.ObjectId(req.headers.person_getting_rating),
        person_giving_rating: mongoose.Types.ObjectId(req.headers.person_giving_rating)
    };
    Rating.findOne(finder).then(rating => {
        if(rating) {
            res.status(200).json({
                status: true,
                found: true,
                rating: rating
            });
        } else {
            res.status(200).json({
                status: true,
                found: false,
            });
        }
    }).catch(err => {
        res.status(200).json({
            status: false,
            err: err
        });
    });
})

router.put("/addrating", (req, res) => {
    Rating.findOneAndUpdate({
      person_giving_rating: req.body.person_giving_rating,
      person_getting_rating: req.body.person_getting_rating,
    }, req.body, {upsert: true, new: true, rawResult: true}).then(rating => {
        res.status(200).json({
            status: true,
            rating: rating
        });
    }).catch(err => {
        res.status(200).json({
            status: false,
            err: err
        });
    });
})

module.exports = router;