const express = require("express");
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.get("/", (req, res) => {
  res.send("Testing the server");
});

app.use("/ai", aiRoutes);

module.exports = app;
