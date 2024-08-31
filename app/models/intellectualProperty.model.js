const mongoose = require("mongoose");

const IntellectualPropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  documentUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const IntellectualProperty = mongoose.model(
  "IntellectualProperty",
  IntellectualPropertySchema
);

module.exports = IntellectualProperty;
