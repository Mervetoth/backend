const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Blockchain Transaction Schema
const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    involvedParties: [
      {
        type: { type: String, required: true }, // e.g., "Creator", "Consumer"
        partyId: { type: Schema.Types.ObjectId, required: true },
      },
    ],
    amount: { type: Number, required: true },
    digitalSignature: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Index for faster search by transactionId
transactionSchema.index({ transactionId: 1 });

// Export the Transaction model
module.exports = mongoose.model("Transaction", transactionSchema);
