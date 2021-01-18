var express = require("express");
var router = express.Router();

const Employee = require("../models/employee");

router.post("/addemployee", (req, res) => {
    const newEmployee = new Employee(req.body);
    newEmployee.save().then(employee => {
        res.status(200).json({
            status: true,
            employee: employee
        });
    }).catch(err => {
        res.status(200).json({
            status: false,
            err: err
        });
    });
})

router.get("/myemployee", (req, res) => {
    Employee.find({recruiter: req.headers.id}).then(employees => {
        res.status(200).json({
            status: true,
            employees: employees
        });
    }).catch(err => {
        res.status(200).json({
            status: false,
            err: err
        });
    });
})

module.exports = router;