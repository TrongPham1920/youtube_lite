const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
