const Channel = require("../models/channel.model");

exports.createChannel = async (req, res) => {
  try {
    const channel = new Channel(req.body);
    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChannel = async (req, res) => {
  try {
    const updated = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
