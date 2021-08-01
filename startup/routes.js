const express = require("express");
var path = require("path");
const cors = require("cors");

const auth = require("../routes/auth");
const error = require("../middleware/error");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(express.json({ limit: "10mb" }));
  app.use(
    express.urlencoded({
      limit: "10mb",
      extended: true,
      parameterLimit: 50000,
    })
  );
  app.use(cors());

  app.use("/api/images", express.static(path.join(__dirname, "images")));
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
