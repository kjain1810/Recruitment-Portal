const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    listings: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
