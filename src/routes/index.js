const express = require("express");
const { register, login } = require("../controllers/user.controller");
const multer = require("multer");
const videoController = require("../controllers/video.controller");
const channelController = require("../controllers/channel.controller");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// Route chính
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Booking API" });
});
router.post("/api/v1/register", register);
router.post("/api/v1/login", login);
router.get(
  "/check-uploaded-chunks/:filename",
  videoController.checkUploadedVideo
);
router.post(
  "/upload-chunk",
  upload.single("chunk"),
  videoController.uploadChunk
);
router.post("/merge-chunks", videoController.mergeChunksAndUpload);
router.get("/api/v1/videos", videoController.getAllVideos);
router.post("/api/v1/videos", videoController.createVideo);
router.get("/api/v1/videos/:id", videoController.getVideoById);
router.get('/videos/channel/:channelId', videoController.getVideosByChannelId);
router.delete("/api/v1/videos/:id", videoController.deleteVideo);
router.patch("/api/v1/videos/:id", videoController.updateVideo);
// Channel
router.post("/api/v1/channels", channelController.createChannel);
router.put("/api/v1/channels/:id", channelController.updateChannel);
router.delete("/api/v1/channels/:id", channelController.deleteChannel);
router.get("/api/v1/channels/:id", channelController.getChannel);
router.get("/api/v1/channels", channelController.getAllChannels);
router.get("/api/v1/channels/user/:userId", channelController.getChannelByUserId);

module.exports = router;
