const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Not a valid email",
      isAsync: false,
    },
  },
  password: {
    type: String,
    required: true,
  },
  collectionid: {
    type: Schema.Types.ObjectId,
    required: true
  },
  collectionname: {
      type: String,
      required: true,
      validate: {
          validator: function(v) {
                return (v === "Applicant") || (v === "Recruiter");
          },
          message: "Invalid collection"
      }
  }
});

module.exports = User = mongoose.model("Users", UserSchema);
