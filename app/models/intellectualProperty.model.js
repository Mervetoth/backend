const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the IP Schema
const iintellectualProperty = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "Creator", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "Creator", required: true },
    title: { type: String, required: true },
    keywords: [{ type: String, required: true }],
    abstract: { type: String, required: true },
    classification: { type: String, required: true },
    blockchainHash: { type: String, required: true }, // Hash of IP details stored on blockchain
    visibility: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Index for faster search by title, keywords, or classification
iintellectualProperty.index({ title: 1, classification: 1, keywords: 1 });

// Export the IP model
module.exports = mongoose.model("IP", iintellectualProperty);
