const fs = require("fs-extra");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const videoModel = require("../models/video.model");
const Channel = require("../models/channel.model");
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

exports.checkUploadedVideo = async (req, res) => {
  const filename = req.params.filename;
  const chunkDir = path.join(UPLOAD_DIR, filename);

  try {
    if (fs.existsSync(chunkDir)) {
      const files = fs.readdirSync(chunkDir);
      return res.json({ uploadedChunks: files });
    } else {
      return res.json({ uploadedChunks: [] });
    }
  } catch (error) {
    console.error("Error checking uploaded chunks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.uploadChunk = async (req, res) => {
  const { filename, chunkIndex } = req.body;
  const chunk = req.file;

  if (!chunk) {
    return res.status(400).json({ message: "No chunk uploaded" });
  }

  const chunkDir = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, `${chunkIndex}`);
  fs.writeFileSync(chunkPath, chunk.buffer);

  res.status(200).json({ message: "Chunk uploaded successfully" });
};

exports.mergeChunksAndUpload = async (req, res) => {
  const { filename, totalChunks } = req.body;
  const chunkDir = path.join(UPLOAD_DIR, filename);
  const mergedPath = path.join(UPLOAD_DIR, `${filename}.mp4`);

  try {
    const writeStream = fs.createWriteStream(mergedPath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, `${i}`);
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
    }

    writeStream.end();

    writeStream.on("finish", async () => {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(mergedPath, {
        resource_type: "video",
        folder: "videos",
      });

      // Xóa file local
      fs.rmSync(chunkDir, { recursive: true, force: true });
      fs.unlinkSync(mergedPath);

      res.status(200).json({
        message: "Upload successful",
        videoUrl: result.secure_url,
      });
    });
  } catch (error) {
    console.error("Error merging chunks:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.streamvideo = async (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await videoModel.find().populate("channelId");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createVideo = async (req, res) => {
  try {
    const video = new videoModel(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getVideoById = async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id).populate("channelId");
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Lấy tất cả video của kênh theo channelId
exports.getVideosByChannelId = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const videos = await videoModel.find({ channelId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No videos found for this channel" });
    }

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// New DELETE controller method
exports.deleteVideo = async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete video from Cloudinary
    const publicId = video.videoUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`videos/${publicId}`, { resource_type: "video" });

    // Delete video from database
    await videoModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: error.message });
  }
};

// New PATCH controller method
exports.updateVideo = async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.channelId) updates.channelId = req.body.channelId;

    const updatedVideo = await videoModel.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("channelId");

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: error.message });
  }
};