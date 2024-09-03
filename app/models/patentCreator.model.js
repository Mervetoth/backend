const mongoose = require("mongoose");
const User = require("./user.model"); // Base User model

// Define the Patent Creator Schema extending from User
const patentCreatorSchema = new mongoose.Schema({
  ips: [{ type: mongoose.Schema.Types.ObjectId, ref: "IP" }],
});

// Create the PatentCreator model using discriminator
const PatentCreator = User.discriminator("PatentCreator", patentCreatorSchema);

module.exports = PatentCreator;
