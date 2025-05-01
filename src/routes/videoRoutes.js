const express = require('express');
const multer = require('multer');
const videoController = require('../controllers/video.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-chunk', upload.single('chunk'), videoController.uploadChunk);
router.post('/merge-chunks', videoController.mergeChunksAndUpload);
router.get("/api/v1/videos", videoController.getAllVideos);
module.exports = router;
