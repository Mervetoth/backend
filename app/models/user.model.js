const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    designation: { type: String, required: true },
  },
  {
    timestamps: true,
    discriminatorKey: "userType", // Ensures proper use of discriminators
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
