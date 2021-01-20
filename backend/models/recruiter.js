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
  bio: {
    type: String,
    validate: {
      validator: function (v) {
        return v.split(" ").length <= 250;
      },
      message: "Max 250 words bio!",
    },
  },
  contact_num: {
    type: String,
    validate: {
      validator: function (v) {
        if (v.length !== 10) {
          return false;
        }
        for (i = 0; i < 10; i++) {
          if (v[i] < "0" || v[i] > "9") {
            return false;
          }
        }
        return true;
      },
      message: "Invalid number",
    },
  },
  rating_sum: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0;
      },
      message: "Invalid rating",
    },
  },
  rating_cnt: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0;
      },
      message: "Invalid number of ratings",
    },
  },
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
