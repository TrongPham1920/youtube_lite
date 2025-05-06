const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ds383ps6m",
  api_key: "336721127316417",
  api_secret: "5Ftty8zDvptkmEljGz6K9q8gCGs",
});

module.exports = cloudinary;
