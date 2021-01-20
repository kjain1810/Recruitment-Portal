const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

var Language = require("./language");
var LanguageSchema = mongoose.model('Language').schema;

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  recruiter: {
    type: Schema.Types.ObjectId,
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
  recruiter_name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "Recruiter name is required!"
    }
  },
  max_applications: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v > 0;
      },
      message: "Maximum number of applications should be a positive integer!",
    },
  },
  max_positions: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v > 0;
      },
      message: "Maximum number of positions should be a positive integer!",
    },
  },
  date_of_posting: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  application_deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.date_of_posting;
      },
      message: "Deadline must be in the future!",
    },
  },
  skillset: {
    type: [LanguageSchema],
    default: [],
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
      message: "Invalid job type",
    },
  },
  duration: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0 && v <= 6;
      },
      message: "Invalid work duration",
    },
  },
  salary: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v > 0;
      },
      message: "Salary should be a positive integer",
    },
  },
  rating_sum: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0;
      },
      message: "Invalid rating sum",
    },
  },
  rating_cnt: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0;
      },
      message: "Invalid number of rating",
    },
  },
  recruited_people: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0;
      },
      message: "Invalid number of recruited people",
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = Job = mongoose.model("Jobs", JobSchema);
