const mongoose = require("mongoose");

const IntellectualPropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  documentUrl: String,
});

const IntellectualProperty = mongoose.model(
  "IntellectualProperty",
  IntellectualPropertySchema
);

module.exports = IntellectualProperty;
