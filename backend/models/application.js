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
            message: "Invalid application status"
        }
    },
    still_eligible: {
        type: Boolean,
        default: true
    }
});

module.exports = Application = mongoose.model("Applications", ApplicationSchema);
