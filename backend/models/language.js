const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    key_name: {
        type: String,
        required: true,
    }
});

module.exports = Language = mongoose.model("Language", LanguageSchema);
