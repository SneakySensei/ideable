const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");

const userRoute = require("./routes/userRoute");
const notesRoute = require("./routes/notesRoute");

// Init Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Body Parser Middleware
app.use(bodyParser.json());

app.use(express.static("./frontend/build/"));
app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname + "/frontend/build/",
  });
});

app.use("/user", userRoute); // Route to handle signin and signup
app.use("/notes", notesRoute); // Route to handle notes CRUD

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
