const mongoose = require("mongoose");
const PatentCreator = require("./app/models/patentCreator.model");
const PatentConsumer = require("./app/models/patentConsumer.model");

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testModels() {
  try {
    console.log("PatentCreator:", PatentCreator);
    console.log("PatentConsumer:", PatentConsumer);
  } catch (err) {
    console.error("Error testing models:", err);
  } finally {
    mongoose.connection.close();
  }
}

testModels();
