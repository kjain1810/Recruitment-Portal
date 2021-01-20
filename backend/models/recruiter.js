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
      validator: function(v) {
        return v.split(" ").length <= 250;
      },
      message: "Max 250 words bio!"
    }
  },
  contact_num: {
    type: String,
    validate: {
      validator: function (v) {
        if(v.length !== 10) {
          return false;
        }
        for(i = 0; i < 10; i++) {
          if(v[i] < '0' || v[i] > '9') {
            return false;
          }
        }
        return true;
      },
      message: "Invalid number"
    }
  }
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
