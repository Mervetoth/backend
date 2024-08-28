const User = require("../models/user.model");
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.userId; // Assuming `userId` is added to the request object by the `verifyToken` middleware

    const updatedData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      walletAddress: req.body.walletAddress,
      profileImageUrl: req.body.profileImageUrl,
    };

    // Remove undefined fields from the update
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    // Find the user and update their information
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in updateUserInfo:", err);

    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
