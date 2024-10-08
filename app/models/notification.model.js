const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Notification Schema
const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who receives the notification
    message: { type: String, required: true }, // Notification message
    type: { type: String, enum: ["approval", "rejection"], required: true }, // Type of notification
    date: { type: Date, default: Date.now }, // Date and time of notification
    isRead: { type: Boolean, default: false }, // Read status
    avatar: { type: String }, // URL or path to the user's avatar image
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Export the Notification model
module.exports = mongoose.model("Notification", notificationSchema);
