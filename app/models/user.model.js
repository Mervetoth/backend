const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    gender: String,
    phoneNumber: String,
    walletAddress: String, // Blockchain wallet address for transactions and ownership verification.
    profileImageUrl: String,

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = User;
