const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  { userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
  {
    name: { type: String, required: true },
    description: String,
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);
