const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const patentCreatorController = require("../controllers/patentCreator.controller");
router.post("/signup", patentCreatorController.signupPatentCreator);

// Middleware to set headers for all routes
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Route to create a new Patent Creator
router.post(
  "/",
  [authJwt.verifyToken],
  patentCreatorController.createPatentCreator
);

// Route to get all Patent Creators
router.get(
  "/",
  [authJwt.verifyToken],
  patentCreatorController.getPatentCreators
);

// Route to get a single Patent Creator by ID
router.get(
  "/:id",
  [authJwt.verifyToken],
  patentCreatorController.getPatentCreatorById
);

// Route to update a Patent Creator by ID
router.put(
  "/:id",
  [authJwt.verifyToken],
  patentCreatorController.updatePatentCreator
);

// Route to delete a Patent Creator by ID
router.delete(
  "/:id",
  [authJwt.verifyToken],
  patentCreatorController.deletePatentCreator
);

module.exports = router;
