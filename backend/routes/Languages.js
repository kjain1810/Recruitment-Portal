var express = require("express");
var router = express.Router();

const Language = require("../models/language");

router.put("/addskill", (req, res) => {
    const skill = req.body.skill;
    Language.findOneAndUpdate({key_name: skill.toLowerCase()}, {$set: {name: skill}}, {new: true, upsert: true}).then(sk => {
        res.status(200).json({
            status: true,
            skill: sk
        });
    }).catch(err => {
        res.status(200).json({
            status: false,
            err: err
        });
    })
})

router.get("/allskills", (req, res) => {
    Language.find({}, function(err, skills) {
        if(err) {
            res.status(200).json({
                status: false,
                err: err
            });
        } else {
            res.status(200).json({
                status: true,
                skills: skills
            });
        }
    });
})

module.exports = router;
