const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Smart Contract Schema
const smartContractSchema = new Schema(
  {
    contractId: { type: String, required: true, unique: true },
    involvedParties: [
      {
        type: { type: String, required: true }, // e.g., "Creator", "Consumer"
        partyId: { type: Schema.Types.ObjectId, required: true },
      },
    ],
    terms: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    blockchainHash: { type: String, required: true }, // Hash of contract details stored on blockchain
  },
  {
    timestamps: true,
  }
);

// Index for faster search by contractId
smartContractSchema.index({ contractId: 1 });

// Export the Smart Contract model
module.exports = mongoose.model("SmartContract", smartContractSchema);
