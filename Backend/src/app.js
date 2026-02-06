const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Testing the server");
});

module.exports = app;
