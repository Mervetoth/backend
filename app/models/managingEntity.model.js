const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Copyright Managing Entity Schema
const managingEntitySchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNo: { type: String, required: true },
    legalStatus: { type: String, required: true },
    managedIPs: [{ type: Schema.Types.ObjectId, ref: "IP" }],
    auditLogs: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        performedBy: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster search by name or legalStatus
managingEntitySchema.index({ name: 1, legalStatus: 1 });

// Export the Managing Entity model
module.exports = mongoose.model("ManagingEntity", managingEntitySchema);
