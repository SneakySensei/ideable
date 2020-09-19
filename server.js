const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");

const userRoute = require("./routes/userRoute");

// Init Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Body Parser Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

app.use("/user", userRoute); // Route to handle signin and signup

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
