const express = require("express");
const router = express.Router();
const intellectualPropertyController = require("../controllers/intellectualProperty.controller");

router.get("/", intellectualPropertyController.getAllIntellectualProperties);
router.get("/:id", intellectualPropertyController.getIntellectualPropertyById);
router.post("/", intellectualPropertyController.createIntellectualProperty);
router.put("/:id", intellectualPropertyController.updateIntellectualProperty);
router.delete(
  "/:id",
  intellectualPropertyController.deleteIntellectualProperty
);

module.exports = router;
