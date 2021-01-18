const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        required: true
    },
    employer: {
        type: Schema.Types.ObjectId,
        required: true
    },
    date_of_joining: {
        type: Date,
        default: () => Date.now()
    },
    job_type: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                if (v === "Full-time") {
                    return true;
                } else if (v === "Part-time") {
                    return true;
                } else if (v === "Work from Home") {
                    return true;
                } else {
                    return false;
                }
            },
            message: "Invalid job type"
        }
    },
    job_title: {
        type: String,
        required: true
    }
});

module.exports = Employee = mongoose.model("Employee", EmployeeSchema);
