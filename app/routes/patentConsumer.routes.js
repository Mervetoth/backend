const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const patentConsumerController = require("../controllers/patentConsumer.controller");
router.post("/signup", patentConsumerController.signupPatentConsumer);

// Middleware to set headers for all routes
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Route to create a new Patent Consumer
router.post(
  "/",
  [authJwt.verifyToken],
  patentConsumerController.createPatentConsumer
);

// Route to get all Patent Consumers
router.get(
  "/",
  [authJwt.verifyToken],
  patentConsumerController.getPatentConsumers
);

// Route to get a single Patent Consumer by ID
router.get(
  "/:id",
  [authJwt.verifyToken],
  patentConsumerController.getPatentConsumerById
);

// Route to update a Patent Consumer by ID
router.put(
  "/:id",
  [authJwt.verifyToken],
  patentConsumerController.updatePatentConsumer
);

// Route to delete a Patent Consumer by ID
router.delete(
  "/:id",
  [authJwt.verifyToken],
  patentConsumerController.deletePatentConsumer
);

module.exports = router;
