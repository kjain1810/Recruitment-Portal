const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const applicantRouter = require("./routes/Applicants");
const jobRouter = require("./routes/Jobs");

app.use(bodyParser.json());

DB_NAME = "assign1";
PORT = 8080;

mongoose.connect("mongodb://127.0.0.1:27017/" + DB_NAME, {
  useNewUrlParser: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

app.use("/applicant", applicantRouter);
app.use("/jobs", jobRouter);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
