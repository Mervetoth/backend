const mongoose = require("mongoose");
const User = require("./user.model"); // Base User model

// Define the Patent Consumer Schema extending from User
const patentConsumerSchema = new mongoose.Schema({
  verified: { type: Boolean, default: false },
  requests: [
    {
      ip: { type: mongoose.Schema.Types.ObjectId, ref: "IP" },
      purpose: { type: String, required: true },
      payment: { type: Number, required: true },
      smartContractId: { type: String, required: true },
    },
  ],
});

// Create the PatentConsumer model using discriminator
const PatentConsumer = User.discriminator(
  "PatentConsumer",
  patentConsumerSchema
);

module.exports = PatentConsumer;
