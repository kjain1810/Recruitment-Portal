const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const RecruiterSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Not a valid email",
      isAsync: false,
    },
  },
  listings: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
