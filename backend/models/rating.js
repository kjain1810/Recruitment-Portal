const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    recruiter: {
        type: Boolean,
        required: true
    },
    person_giving_rating: {
        type: Schema.Types.ObjectId,
        required: true
    },
    person_getting_rating: {
        type: Schema.Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return Number.isInteger(v) && v >= 0 && v <= 5;
            },
            message: "Invalid rating"
        }
    }
});

module.exports = Rating = mongoose.model("Ratings", RatingSchema);
