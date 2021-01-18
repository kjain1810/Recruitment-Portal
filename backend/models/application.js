const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        required: true
    },
    applicant: {
        type: Schema.Types.ObjectId,
        required: true
    },
    recruiter: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sop: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                v.length > 0;
            },
            message: "SOP is required"
        }
    },
    status: {
        type: String,
        required: true,
        default: "Applied",
        validate: {
            validator: function (v) {
                if (v === "Accepted") {
                    return true;
                } else if (v === "Rejected") {
                    return true;
                } else if (v === "Shortlist") {
                    return true;
                } else if(v === "Applied"){
                    return true;
                } else {
                    return false;
                }
            },
            message: "Invalid application status"
        }
    },
    date: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        required: true
    },
    still_eligible: {
        type: Boolean,
        default: true
    }
});

module.exports = Application = mongoose.model("Applications", ApplicationSchema);
