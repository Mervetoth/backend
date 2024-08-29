const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const User = require("../models/user.model");

module.exports = function (app) {
  // Middleware to set headers for all routes
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Public route
  app.get("/api/test/all", controller.allAccess);

  // User-specific route
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // Moderator-specific route
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // Admin-specific route
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Route to update profile image for the authenticated user
  app.post(
    "/api/test/uploadProfileImage",
    [authJwt.verifyToken],
    async (req, res) => {
      try {
        const userId = req.userId; // `userId` is added by the `verifyToken` middleware

        if (!req.body.profileImageUrl) {
          return res
            .status(400)
            .json({ error: "Profile image URL is required" });
        }

        const user = await User.findByIdAndUpdate(
          userId,
          { profileImageUrl: req.body.profileImageUrl },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ profileImageUrl: user.profileImageUrl });
      } catch (err) {
        console.error("Error updating profile image:", err);
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  );

  // Route to get the latest profile image for the authenticated user
  app.get(
    "/api/test/getLatestProfileImage",
    [authJwt.verifyToken],
    async (req, res) => {
      try {
        const userId = req.userId; // `userId` is added by the `verifyToken` middleware

        const user = await User.findById(userId);

        if (!user || !user.profileImageUrl) {
          return res.status(404).json({ error: "Profile image not found" });
        }

        res.status(200).json({ profileImageUrl: user.profileImageUrl });
      } catch (err) {
        console.error("Error fetching profile image:", err);
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  );

  // Route to update user information
  app.post(
    "/api/user/update",
    [authJwt.verifyToken],
    controller.updateUserInfo
  );
};
