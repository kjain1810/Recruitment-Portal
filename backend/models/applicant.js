//jshint esversion:6
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const ApplicantSchema = new Schema({
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
  institute_name: {
    type: String,
    required: true,
  },
  start_year: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        date = new Date();
        year = date.getFullYear();
        return Number.isInteger(v) && v <= year;
      },
      message: "Invalid start time",
    },
  },
  finish_year: {
    type: Number,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && this.start_year <= v;
      },
      // validator: v => Number.isInteger(v) && this.start_year <= v,
      message: "Finish year can't be before start year",
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
  resume: {
    type: Buffer,
  },
  photo: {
    type: Buffer,
  },
  ratings: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  accepted: {
    type: Boolean,
    default: true,
  },
});
module.exports = Applicant = mongoose.model("Applicants", ApplicantSchema);
