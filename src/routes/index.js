const express = require("express");
const { register, login } = require("../controllers/user.controller");
const multer = require("multer");
const videoController = require("../controllers/video.controller");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// Route chính
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Booking API" });
});
router.post("/api/v1/register", register);
router.post("/api/v1/login", login);
// Thêm các routes khác ở đây
// router.use('/api/bookings', require('./booking.routes'));
// router.use('/api/users', require('./user.routes'));
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
module.exports = router;
