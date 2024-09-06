const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    designation: { type: String, required: true },
    password: {
      type: String,
      required: true, // Ensure password is required
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    discriminatorKey: "userType",
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
