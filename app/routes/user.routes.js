const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const User = require("../models/user.model");
module.exports = function (app) {
  // Middleware to set headers
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Define routes
  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Route to update profile picture for the connected user
  app.post(
    "/api/test/uploadProfileImage",
    [authJwt.verifyToken],
    async (req, res) => {
      try {
        const userId = req.userId; // Assuming `userId` is stored in the request object by the `verifyToken` middleware

        if (!req.body.profileImageUrl) {
          return res.status(400).json({ error: "Image URL is required" });
        }

        // Find the user and update their profile image
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
        console.error("Something went wrong", err);
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  );

  // Example route to get the latest profile image (if needed)
  app.get(
    "/api/test/getLatestProfileImage",
    [authJwt.verifyToken],
    async (req, res) => {
      try {
        const userId = req.userId; // Assuming `userId` is stored in the request object by the `verifyToken` middleware
        const user = await User.findById(userId);

        if (!user || !user.profileImageUrl) {
          return res.status(404).json({ error: "Profile image not found" });
        }

        res.json({ profileImageUrl: user.profileImageUrl });
      } catch (err) {
        console.error("Something went wrong", err);
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  );
  app.post(
    "/api/user/update",
    [authJwt.verifyToken],
    controller.updateUserInfo
  );
};
