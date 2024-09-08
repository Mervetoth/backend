const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the IP Schema for Artworks
const intellectualPropertySchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "Creator", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    title: { type: String, required: true },
    keywords: [{ type: String }],
    classification: { type: String, required: true },
    description: { type: String, required: true }, // Updated to 'description'
    blockchainHash: { type: String, required: true },
    blockchainTransactionId: { type: String },
    blockchainContractAddress: { type: String },
    dateOfCreation: { type: Date, default: Date.now },
    documentUrl: { type: String },
    status: { type: String, default: "pending" },
    visibility: { type: Boolean, default: true },
    metadata: { type: String },
  },
  {
    timestamps: true,
  }
);

// Index for faster search by title, keywords, or classification
intellectualPropertySchema.index({ title: 1, classification: 1, keywords: 1 });

// Export the IP model
module.exports = mongoose.model(
  "IntellectualProperty",
  intellectualPropertySchema
);
