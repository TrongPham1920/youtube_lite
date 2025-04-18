const express = require("express");
const cors = require("cors");

const configureExpress = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  return app;
};

module.exports = configureExpress;
