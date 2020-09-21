const mongoose = require("mongoose");
const dbCreds = require("./dbCreds");

// Replace this with your MONGOURI.
const MONGOURI = `mongodb+srv://ideableAdmin:${
  process.env.dbPass || dbCreds.password
}@cluster0.pptuz.azure.mongodb.net/ideableDB?retryWrites=true&w=majority`;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
